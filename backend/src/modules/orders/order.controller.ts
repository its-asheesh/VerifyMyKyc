import { Request, Response } from 'express';
import { Order, IOrder } from './order.model';
import { Coupon } from '../coupons/coupon.model';
import asyncHandler from '../../common/middleware/asyncHandler';
import { VerificationPricing, HomepagePlan } from '../pricing/pricing.model';
import { razorpay } from '../../common/services/razorpay';
import crypto from 'crypto';
// Create new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const {
    orderType,
    serviceName,
    serviceDetails,
    totalAmount,
    finalAmount,
    billingPeriod,
    paymentMethod,
    couponApplied
  } = req.body;

  console.log('Creating order with data:', {
    orderType,
    serviceName,
    serviceDetails,
    totalAmount,
    finalAmount,
    billingPeriod,
    paymentMethod,
    couponApplied
  });

  const userId = req.user._id;
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  console.log('Generated orderId:', orderId);

  // Prepare verification quota if this is a verification order
  let verificationQuota: {
    totalAllowed: number;
    used: number;
    remaining: number;
    validityDays: number;
  } | undefined = undefined;

  if (orderType === 'verification' && serviceDetails?.verificationType) {
    try {
      const pricing = await VerificationPricing.findOne({ verificationType: serviceDetails.verificationType });
      if (pricing) {
        let quotaCfg: { count: number; validityDays: number } | undefined;
        switch (billingPeriod) {
          case 'monthly':
            quotaCfg = pricing.monthlyQuota as any;
            break;
          case 'yearly':
            quotaCfg = pricing.yearlyQuota as any;
            break;
          default:
            quotaCfg = pricing.oneTimeQuota as any;
        }
        if (quotaCfg && typeof quotaCfg.count === 'number') {
          verificationQuota = {
            totalAllowed: quotaCfg.count,
            used: 0,
            remaining: quotaCfg.count,
            validityDays: quotaCfg.validityDays || 0,
          };
        }
      }
    } catch (e) {
      console.error('Failed to load verification pricing for quota initialization:', e);
    }
  }

  const orderData: any = {
    userId,
    orderId,
    orderType,
    serviceName,
    serviceDetails,
    totalAmount,
    finalAmount,
    billingPeriod,
    paymentMethod,
    paymentStatus: 'pending',
    startDate: new Date() // Add this to ensure startDate is set
  };

  if (verificationQuota) {
    orderData.verificationQuota = verificationQuota;
  }

  // Add coupon information if provided
  if (couponApplied) {
    orderData.couponApplied = couponApplied;
  }

  const order = await Order.create(orderData);

// Razorpay order creation starts here
 // make sure to import at top

const paymentCapture = 1; // 1 for automatic capture
const currency = "INR";

const options = {
  amount: finalAmount * 100, // amount in paise
  currency,
  receipt: order.orderId,
  payment_capture: paymentCapture,
};

const razorpayOrder = await razorpay.orders.create(options);

// Update coupon usage if a coupon was applied
if (couponApplied && order) {
  try {
    const coupon = await Coupon.findById(couponApplied.couponId);
    if (coupon) {
      coupon.usedCount += 1;
      coupon.usageHistory.push({
        userId: req.user._id,
        orderId: order._id,
        usedAt: new Date(),
        discountApplied: couponApplied.discount
      });
      await coupon.save();
      console.log('Coupon usage updated successfully');
    }
  } catch (error) {
    console.error('Failed to update coupon usage:', error);
    // Don't fail order creation if coupon update fails
  }
}

// Respond with order + Razorpay info
res.status(201).json({
  success: true,
  message: 'Order created successfully',
  data: {
    order,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency
  }
});


  // Update coupon usage if a coupon was applied
  if (couponApplied && order) {
    try {
      const coupon = await Coupon.findById(couponApplied.couponId);
      if (coupon) {
        coupon.usedCount += 1;
        coupon.usageHistory.push({
          userId: req.user._id,
          orderId: order._id,
          usedAt: new Date(),
          discountApplied: couponApplied.discount
        });
        await coupon.save();
        console.log('Coupon usage updated successfully');
      }
    } catch (error) {
      console.error('Failed to update coupon usage:', error);
      // Don't fail order creation if coupon update fails
    }
  }

  console.log('Order created successfully:', order);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: { order }
  });
});

// Process payment and activate order
export const processPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, transactionId } = req.body;

  const order = await Order.findOne({ orderId, userId: req.user._id });
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.paymentStatus === 'completed') {
    return res.status(400).json({ message: 'Payment already processed' });
  }

  // Update order with payment success
  order.paymentStatus = 'completed';
  order.transactionId = transactionId;
  order.status = 'active';
  order.startDate = new Date();

  // Recompute end date using quota validity if available, otherwise by billing period
  try {
    const start = order.startDate ? new Date(order.startDate) : new Date();
    let newEnd = new Date(start);
    if (order.orderType === 'verification' && order.verificationQuota?.validityDays) {
      newEnd.setDate(newEnd.getDate() + order.verificationQuota.validityDays);
      order.endDate = newEnd;
      if (order.verificationQuota) {
        order.verificationQuota.expiresAt = newEnd;
      }
    } else {
      switch (order.billingPeriod) {
        case 'one-time':
          newEnd.setFullYear(newEnd.getFullYear() + 1);
          break;
        case 'monthly':
          newEnd.setMonth(newEnd.getMonth() + 1);
          break;
        case 'yearly':
          newEnd.setFullYear(newEnd.getFullYear() + 1);
          break;
      }
      order.endDate = newEnd;
    }
  } catch (err) {
    console.error('Failed to recompute endDate on payment:', err);
  }
  
  await order.save();

  // If this is a plan purchase, auto-provision included verification quotas as separate verification orders
  try {
    if (order.orderType === 'plan' && order.paymentStatus === 'completed' && order.status === 'active') {
      const planType = (order.serviceDetails?.planType === 'monthly' || order.serviceDetails?.planType === 'yearly')
        ? order.serviceDetails.planType
        : (order.billingPeriod === 'monthly' || order.billingPeriod === 'yearly') ? order.billingPeriod : 'monthly';

      const planName = order.serviceDetails?.planName;
      if (planName) {
        const plan = await HomepagePlan.findOne({ planType, planName });
        if (plan && Array.isArray(plan.includesVerifications) && plan.includesVerifications.length > 0) {
          for (const vType of plan.includesVerifications) {
            try {
              // Lookup pricing for the included verification type to determine quota
              const pricing = await VerificationPricing.findOne({ verificationType: vType });
              if (!pricing) {
                console.warn(`processPayment: No pricing found for included verification type '${vType}'`);
                continue;
              }

              const quotaCfg = planType === 'yearly' ? pricing.yearlyQuota : pricing.monthlyQuota;
              if (!quotaCfg || typeof (quotaCfg as any).count !== 'number' || (quotaCfg as any).count <= 0) {
                console.warn(`processPayment: No usable quota config for type '${vType}' under planType '${planType}'`);
                continue;
              }

              // Create a child verification order representing the included quota for this verification type
              const childOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              await Order.create({
                userId: order.userId,
                orderId: childOrderId,
                orderType: 'verification',
                serviceName: `${vType.toUpperCase()} Verification (Included in ${planName} ${planType})`,
                serviceDetails: { verificationType: vType, features: ['Included via plan'] },
                totalAmount: 0,
                finalAmount: 0,
                billingPeriod: planType,
                paymentMethod: order.paymentMethod,
                paymentStatus: 'completed',
                status: 'active',
                startDate: order.startDate || new Date(),
                verificationQuota: {
                  totalAllowed: (quotaCfg as any).count,
                  used: 0,
                  remaining: (quotaCfg as any).count,
                  validityDays: (quotaCfg as any).validityDays || (planType === 'monthly' ? 30 : 365),
                },
              });
              console.log(`processPayment: Provisioned included '${vType}' verification quota from plan '${planName}'`);
            } catch (childErr) {
              console.error('processPayment: Failed to create included verification order', { vType, planType, planName, err: childErr });
            }
          }
        } else {
          console.log(`processPayment: Plan '${planName}' (${planType}) has no includesVerifications or plan not found`);
        }
      }
    }
  } catch (provisionErr) {
    console.error('processPayment: Error while provisioning included verification quotas for plan', provisionErr);
    // Do not fail the payment response due to provisioning errors
  }

  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: { order }
  });
});

// Get user's orders
export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { status, orderType } = req.query;

  const filter: any = { userId };
  
  if (status) filter.status = status;
  if (orderType) filter.orderType = orderType;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');

  res.json({
    success: true,
    data: { orders }
  });
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({ orderId, userId })
    .populate('userId', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({
    success: true,
    data: { order }
  });
});

// Get user's active services
export const getActiveServices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const now = new Date();

  // Get all orders that were active and payment completed
  const orders = await Order.find({
    userId,
    paymentStatus: 'completed'
  }).sort({ endDate: 1 });

  // Check and update expired orders
  const updatedOrders = [];
  for (const order of orders) {
    if (order.endDate && new Date(order.endDate) < now && order.status === 'active') {
      // Service has expired, update status
      order.status = 'expired';
      await order.save();
      console.log(`Order ${order._id} marked as expired`);
    }
    updatedOrders.push(order);
  }

  // Filter for truly active services (not expired)
  const activeOrders = updatedOrders.filter(order => 
    order.status === 'active' && 
    order.endDate && 
    new Date(order.endDate) >= now
  );

  // Group by order type
  const services = {
    verifications: activeOrders.filter(order => order.orderType === 'verification'),
    plans: activeOrders.filter(order => order.orderType === 'plan')
  };

  res.json({
    success: true,
    data: { services }
  });
});

// Cancel order
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({ orderId, userId });
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.status === 'cancelled') {
    return res.status(400).json({ message: 'Order already cancelled' });
  }

  order.status = 'cancelled';
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order }
  });
});

// Admin: Get all orders
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, orderType, userId } = req.query;

  const filter: any = {};
  
  if (status) filter.status = status;
  if (orderType) filter.orderType = orderType;
  if (userId) filter.userId = userId;

  const orders = await Order.find(filter)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { orders }
  });
});

// Admin: Update order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({ orderId });
  
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status;
  await order.save();

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: { order }
  });
});

// controllers/order/verifyPayment.ts


export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required payment details'
    });
  }

  // Verify Razorpay signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });
  }

  // Find the order by your internal orderId
  const order = await Order.findOne({ orderId, paymentStatus: 'pending' });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or already processed'
    });
  }

  // Update payment details
  order.paymentStatus = 'completed';
  order.transactionId = razorpay_payment_id;
  order.status = 'active';
  order.startDate = new Date();

  // Recompute endDate (already in your processPayment logic)
  try {
    const start = new Date(order.startDate);
    let newEnd = new Date(start);

    if (order.orderType === 'verification' && order.verificationQuota?.validityDays) {
      newEnd.setDate(newEnd.getDate() + order.verificationQuota.validityDays);
      order.endDate = newEnd;
      if (order.verificationQuota) {
        order.verificationQuota.expiresAt = newEnd;
      }
    } else {
      switch (order.billingPeriod) {
        case 'one-time':
          newEnd.setFullYear(newEnd.getFullYear() + 1);
          break;
        case 'monthly':
          newEnd.setMonth(newEnd.getMonth() + 1);
          break;
        case 'yearly':
          newEnd.setFullYear(newEnd.getFullYear() + 1);
          break;
      }
      order.endDate = newEnd;
    }
  } catch (err) {
    console.error('Failed to recompute endDate:', err);
  }

  await order.save();

  // 🔁 Reuse your plan provisioning logic
  try {
    if (order.orderType === 'plan' && order.status === 'active') {
      const planType = order.serviceDetails?.planType || order.billingPeriod;
      const planName = order.serviceDetails?.planName;

      if (planName) {
        const { HomepagePlan } = await import('../pricing/pricing.model');
        const plan = await HomepagePlan.findOne({ planType, planName });

        if (plan && Array.isArray(plan.includesVerifications)) {
          const { VerificationPricing } = await import('../pricing/pricing.model');

          for (const vType of plan.includesVerifications) {
            const pricing = await VerificationPricing.findOne({ verificationType: vType });
            if (!pricing) continue;

            const quotaCfg = planType === 'yearly' ? pricing.yearlyQuota : pricing.monthlyQuota;
            if (!quotaCfg || typeof (quotaCfg as any).count !== 'number' || (quotaCfg as any).count <= 0) continue;

            const childOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            await Order.create({
              userId: order.userId,
              orderId: childOrderId,
              orderType: 'verification',
              serviceName: `${vType.toUpperCase()} Verification (Included in ${planName})`,
              serviceDetails: { verificationType: vType },
              totalAmount: 0,
              finalAmount: 0,
              billingPeriod: planType,
              paymentMethod: order.paymentMethod,
              paymentStatus: 'completed',
              status: 'active',
              startDate: order.startDate,
              endDate: order.endDate,
              verificationQuota: {
                totalAllowed: (quotaCfg as any).count,
                used: 0,
                remaining: (quotaCfg as any).count,
                validityDays: (quotaCfg as any).validityDays || (planType === 'monthly' ? 30 : 365),
                expiresAt: order.endDate
              }
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error provisioning plan verifications:', err);
    // Don't fail response
  }

  res.json({
    success: true,
    message: 'Payment verified and order activated',
    data: { order }
  });
});

// Admin: Get order statistics
export const getOrderStats = asyncHandler(async (req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments();
  const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });
  const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });
  const activeOrders = await Order.countDocuments({ status: 'active' });
  const expiredOrders = await Order.countDocuments({ status: 'expired' });

  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$finalAmount' } } }
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      completedOrders,
      pendingOrders,
      activeOrders,
      expiredOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    }
  });
}); 