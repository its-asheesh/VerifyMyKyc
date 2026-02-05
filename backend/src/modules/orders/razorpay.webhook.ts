// Razorpay Webhook Handler
// This handles payment events from Razorpay, especially important for QR code payments
// where users might not return to the frontend after payment

import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import crypto from 'crypto';
import { Order } from './order.model';
import { razorpay } from '../../common/services/razorpay';

export const handleRazorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  // Get the webhook signature from headers
  const webhookSignature = req.headers['x-razorpay-signature'] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

  if (!webhookSignature || !webhookSecret) {
    console.error('Razorpay webhook: Missing signature or secret');
    return res.status(400).json({ error: 'Missing webhook signature or secret' });
  }

  // Verify webhook signature
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== webhookSignature) {
    console.error('Razorpay webhook: Invalid signature');
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`Razorpay webhook received: ${event}`, {
    paymentId: payload?.payment?.entity?.id,
    orderId: payload?.payment?.entity?.order_id
  });

  // Handle payment success events
  if (event === 'payment.captured' || event === 'payment.authorized') {
    const payment = payload?.payment?.entity;

    if (!payment) {
      console.error('Razorpay webhook: Missing payment entity');
      return res.status(400).json({ error: 'Missing payment entity' });
    }

    const razorpayPaymentId = payment.id;
    const razorpayOrderId = payment.order_id;
    const paymentStatus = payment.status;

    // Only process if payment is captured/authorized
    if (paymentStatus !== 'captured' && paymentStatus !== 'authorized') {
      console.log(`Razorpay webhook: Payment not captured/authorized, status: ${paymentStatus}`);
      return res.status(200).json({ received: true });
    }

    try {
      // Fetch payment details from Razorpay to get the full order details
      const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);
      const paymentAmountPaise = Number(razorpayPayment.amount);
      const paymentAmount = paymentAmountPaise / 100; // Razorpay amounts are returned in paise

      if (Number.isNaN(paymentAmountPaise)) {
        console.error(`Razorpay webhook: Invalid payment amount for ${razorpayPaymentId}`);
        return res.status(200).json({ received: true, message: 'Invalid payment amount' });
      }

      // Find order by Razorpay order ID (stored in order.razorpayOrderId or similar)
      // We need to check if we store razorpayOrderId in the order
      let order = await Order.findOne({
        $or: [
          { transactionId: razorpayPaymentId },
          { 'razorpayOrderId': razorpayOrderId }
        ],
        paymentStatus: 'pending'
      });

      // If not found by razorpayOrderId, try to find by matching the amount and recent creation
      if (!order && razorpayPayment.order_id) {
        // Try to find by amount and recent date (within last hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const orders = await Order.find({
          paymentStatus: 'pending',
          finalAmount: paymentAmount, // Razorpay amounts are in paise
          createdAt: { $gte: oneHourAgo }
        }).sort({ createdAt: -1 });

        // Match by amount (with small tolerance) and currency
        order = orders.find(o =>
          Math.abs(o.finalAmount - paymentAmount) < 1 &&
          o.currency === razorpayPayment.currency
        ) || null;
      }

      if (!order) {
        console.error(`Razorpay webhook: Order not found for payment ${razorpayPaymentId}`);
        // Still return 200 to prevent Razorpay from retrying
        return res.status(200).json({ received: true, message: 'Order not found' });
      }

      // Update order status
      order.paymentStatus = 'completed';
      order.transactionId = razorpayPaymentId;
      order.status = 'active';
      order.startDate = new Date();

      // Store Razorpay order ID for future reference
      if (!order.razorpayOrderId) {
        (order as any).razorpayOrderId = razorpayOrderId;
      }

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

      // If it's a plan, auto-provision included verifications
      // Auto-provisioning logic removed as plans are no longer supported
      // (Previously provisioning based on monthly/yearly quotas)

      console.log(`Razorpay webhook: Order ${order.orderId} activated successfully`);
      return res.status(200).json({ received: true, orderId: order.orderId });
    } catch (error: any) {
      console.error('Razorpay webhook: Error processing payment:', error);
      // Return 200 to prevent Razorpay from retrying, but log the error
      return res.status(200).json({ received: true, error: error.message });
    }
  }

  // Handle payment failure events
  if (event === 'payment.failed') {
    const payment = payload?.payment?.entity;
    if (payment) {
      const razorpayPaymentId = payment.id;

      // Find and mark order as failed
      const order = await Order.findOne({
        $or: [
          { transactionId: razorpayPaymentId },
          { 'razorpayOrderId': payment.order_id }
        ],
        paymentStatus: 'pending'
      });

      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
        console.log(`Razorpay webhook: Order ${order.orderId} marked as failed`);
      }
    }
  }

  // Always return 200 to acknowledge receipt
  res.status(200).json({ received: true });
});


