import { Request, Response } from 'express';
import { Order, IOrder } from './order.model';
import { Coupon } from '../coupons/coupon.model';
import asyncHandler from '../../common/middleware/asyncHandler';
import { VerificationPricing, HomepagePlan } from '../pricing/pricing.model';
import { razorpay } from '../../common/services/razorpay';
import { sendGaEvent } from '../../common/services/ga4';
import { logger } from '../../common/utils/logger';
import crypto from 'crypto';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { CreateOrderRequest, ProcessPaymentRequest } from '../../common/validation/schemas';
// Create new order
export const createOrder = asyncHandler(async (req: AuthenticatedRequest<{}, {}, CreateOrderRequest>, res: Response) => {
  const {
    orderType,
    serviceName,
    serviceDetails,
    totalAmount,
    finalAmount,
    billingPeriod,
    paymentMethod,
    couponApplied,
  } = req.body;

  logger.info('Creating order with data:', {
    userId: req.user._id,
    orderType,
    serviceName,
    totalAmount,
    finalAmount,
    billingPeriod, // Log concise info
  });

  const userId = req.user._id;
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  logger.info('Generated orderId:', { orderId });

  // Prepare verification quota if this is a verification order
  let verificationQuota:
    | {
      totalAllowed: number;
      used: number;
      remaining: number;
      validityDays: number;
    }
    | undefined = undefined;

  if (orderType === 'verification' && serviceDetails?.verificationType) {
    try {
      const pricing = await VerificationPricing.findOne({
        verificationType: serviceDetails.verificationType,
      });
      if (pricing) {
        let quotaCfg: { count: number; validityDays: number } | undefined;
        // One-time pricing only
        quotaCfg = pricing.oneTimeQuota as any;
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

  // Derive a clearer serviceName for verification orders (e.g., PAN, GSTIN)
  let serviceNameToUse: string = serviceName || '';
  try {
    if (orderType === 'verification') {
      const rawType = (serviceDetails as any)?.verificationType;
      if (typeof rawType === 'string' && rawType.trim().length > 0) {
        const parts = rawType
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)
          .map((s: string) => s.toUpperCase());
        if (parts.length > 0) {
          serviceNameToUse = parts.join(', ');
        }
      }
    }
  } catch (e) {
    // Fallback silently to provided serviceName
  }

  const orderData: any = {
    userId,
    orderId,
    orderType,
    serviceName: serviceNameToUse,
    serviceDetails,
    totalAmount,
    finalAmount,
    billingPeriod,
    paymentMethod,
    paymentStatus: 'pending',
    status: 'pending',
    startDate: new Date(), // Add this to ensure startDate is set
  };

  if (verificationQuota) {
    orderData.verificationQuota = verificationQuota;
  }

  // Add coupon information if provided
  if (couponApplied) {
    orderData.couponApplied = couponApplied;
  }

  const order = await Order.create(orderData);

  // GA4: order_created
  try {
    await sendGaEvent(String(req.user._id), 'order_created', {
      order_id: order.orderId,
      value: Number(order.finalAmount) || 0,
      currency: order.currency || 'INR',
      order_type: order.orderType,
      service: (order.serviceDetails as any)?.verificationType || order.serviceName,
    });
  } catch { }

  // Razorpay order creation starts here
  // make sure to import at top

  const paymentCapture = 1; // 1 for automatic capture
  const currency = 'INR';

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    logger.error('Razorpay env missing: RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not set');
    return res.status(500).json({
      success: false,
      message: 'Payment gateway is not configured. Please contact support.',
      code: 'RAZORPAY_CONFIG_MISSING',
    });
  }

  let razorpayOrder;
  try {
    const options = {
      amount: Math.round(Number(finalAmount) * 100) || 0, // amount in paise
      currency,
      receipt: order.orderId,
      payment_capture: paymentCapture,
    } as any;

    if (!options.amount || options.amount <= 0) {
      console.warn('createOrder: Invalid amount for Razorpay', { finalAmount });
    }

    razorpayOrder = await razorpay.orders.create(options);

    // Store Razorpay order ID in our order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();
  } catch (err: any) {
    logger.error('Razorpay order creation failed:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: 'Payment initialization failed',
      code: 'RAZORPAY_ORDER_CREATE_FAILED',
    });
  }

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
          discountApplied: couponApplied.discount,
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
      currency: razorpayOrder.currency,
    },
  });
  return; // prevent double response
});

// Process payment and activate order
export const processPayment = asyncHandler(async (req: AuthenticatedRequest<{}, {}, ProcessPaymentRequest>, res: Response) => {
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
    const newEnd = new Date(start);
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

  // Auto-provisioning logic removed as plans are no longer supported
  // If plans are re-introduced, this logic needs to be updated to use the new schema
  // (Previously provisioning based on monthly/yearly quotas)

  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: { order },
  });

  // GA4: payment_verified (fire and forget)
  try {
    await sendGaEvent(String(req.user._id), 'payment_verified', {
      order_id: order.orderId,
      value: Number(order.finalAmount) || 0,
      currency: order.currency || 'INR',
      payment_method: order.paymentMethod,
    });
  } catch { }
});

// Get user's orders
export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { status, orderType } = req.query;

  const filter: any = { userId };

  if (status) filter.status = status;
  if (orderType) filter.orderType = orderType;

  const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('userId', 'name email');

  res.json({
    success: true,
    data: { orders },
  });
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({ orderId, userId }).populate('userId', 'name email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({
    success: true,
    data: { order },
  });
});

// Get user's active services
export const getActiveServices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const now = new Date();

  // Get all orders that were active and payment completed
  const orders = await Order.find({
    userId,
    paymentStatus: 'completed',
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
  const activeOrders = updatedOrders.filter(
    (order) => order.status === 'active' && order.endDate && new Date(order.endDate) >= now,
  );

  // Group by order type
  const services = {
    verifications: activeOrders.filter((order) => order.orderType === 'verification'),
    plans: activeOrders.filter((order) => order.orderType === 'plan'),
  };

  res.json({
    success: true,
    data: { services },
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
    data: { order },
  });
});

// Admin: Get all orders
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, orderType, userId } = req.query;

  const filter: any = {};

  if (status) filter.status = status;
  if (orderType) filter.orderType = orderType;
  if (userId) filter.userId = userId;

  const orders = await Order.find(filter).populate('userId', 'name email').sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { orders },
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
    data: { order },
  });
});

// verifyPayment is handled in specific file: verifyPayment.ts

// Admin: Get order statistics
export const getOrderStats = asyncHandler(async (req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments();
  const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });
  const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });
  const activeOrders = await Order.countDocuments({ status: 'active' });
  const expiredOrders = await Order.countDocuments({ status: 'expired' });

  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$finalAmount' } } },
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      completedOrders,
      pendingOrders,
      activeOrders,
      expiredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});
