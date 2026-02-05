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
    // Auto-provisioning logic removed as plans are no longer supported
    // (Previously provisioning based on monthly/yearly quotas)
  } catch (err) {
    console.error('Error provisioning plan verifications:', err);
  }

  res.json({
    success: true,
    message: 'Payment verified and order activated',
    data: { order }
  });
});