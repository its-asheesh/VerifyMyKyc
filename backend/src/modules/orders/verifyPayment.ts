// controllers/order/verifyPayment.ts

import { Request, Response } from 'express';
import { Order } from './order.model'; // Adjust path as needed
import asyncHandler from '../../common/middleware/asyncHandler';
import crypto from 'crypto';
import { razorpay } from '../../common/services/razorpay';

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

  // Find your internal order
  const order = await Order.findOne({ orderId, paymentStatus: 'pending' });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found or already processed'
    });
  }

  // Activate the order
  order.paymentStatus = 'completed';
  order.transactionId = razorpay_payment_id;
  order.status = 'active';
  order.startDate = new Date();

  // Recalculate endDate
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

  await order.save();

  // 🔁 If it's a plan, auto-provision included verifications (same logic as processPayment)
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
  }

  res.json({
    success: true,
    message: 'Payment verified and order activated',
    data: { order }
  });
});