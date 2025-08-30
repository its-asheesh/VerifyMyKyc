// backend/controllers/paymentController.ts
import { Request, Response } from 'express'
import Razorpay from 'razorpay'
import { razorpayConfig } from '../../config/payment'
import {Order} from '../orders/order.model' // assuming you have an Order model

const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret
})

// Create Razorpay Order
// Add debug logging to createRazorpayOrder
export const createRazorpayOrder = async (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;

  console.log('🔍 Creating Razorpay order:', { amount, currency, receipt });

  if (!razorpayConfig.key_id || !razorpayConfig.key_secret) {
    console.error('❌ Razorpay credentials missing:', {
      key_id: razorpayConfig.key_id ? 'SET' : 'MISSING',
      key_secret: razorpayConfig.key_secret ? 'SET' : 'MISSING'
    });
    return res.status(500).json({ 
      success: false, 
      message: 'Razorpay credentials not configured' 
    });
  }

  try {
    const options = {
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);
    return res.status(200).json({ success: true, order });
  } catch (error: any) {
    console.error('❌ Razorpay order creation error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create order', 
      error: error.message 
    });
  }
};

// Verify Payment Signature (important for security)
export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', razorpayConfig.key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex')

  if (expectedSignature === razorpay_signature) {
    // ✅ Payment is verified
    return res.status(200).json({ success: true, message: 'Payment verified' })
  } else {
    return res.status(400).json({ success: false, message: 'Invalid signature' })
  }
}

// After verification, update order status
export const updateOrderAfterPayment = async (req: Request, res: Response) => {
  const { orderId, paymentId, signature } = req.body

  try {
    // Verify payment first
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', razorpayConfig.key_secret)
      .update(orderId + '|' + paymentId)
      .digest('hex')

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' })
    }

    // Update order in DB
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentId,
        signature,
        status: 'paid',
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    return res.status(200).json({ success: true, order })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return res.status(500).json({ success: false, message: 'Failed to update order' })
  }
}