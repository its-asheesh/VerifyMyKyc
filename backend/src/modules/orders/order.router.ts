import { Router } from 'express';
import {
  createOrder,
  processPayment,
  getUserOrders,
  getOrderById,
  getActiveServices,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from './order.controller';
import { authenticate, requireAdmin, requireUser } from '../../common/middleware/auth';

import { validate } from '../../common/validation/middleware';
import { createOrderSchema, verifyPaymentSchema, processPaymentSchema } from '../../common/validation/schemas';
// routes/order.routes.ts
import { verifyPayment } from './verifyPayment';
import { handleRazorpayWebhook } from './razorpay.webhook';

const router = Router();

// Admin routes (require admin role) - Must come before parameterized routes
router.get('/stats/overview', authenticate, requireAdmin, getOrderStats);

// Razorpay webhook (no auth required - uses signature verification)
router.post('/razorpay-webhook', handleRazorpayWebhook);

// User routes (require authentication)
router.post('/', authenticate, requireUser, validate(createOrderSchema), createOrder);
router.post('/process-payment', authenticate, requireUser, validate(processPaymentSchema), processPayment);
router.get('/my-orders', authenticate, requireUser, getUserOrders);
router.get('/my-services', authenticate, requireUser, getActiveServices);
router.post('/verify-payment', validate(verifyPaymentSchema), verifyPayment);

// Admin routes (require admin role)
router.get('/', authenticate, requireAdmin, getAllOrders);

// Parameterized routes - Must come after specific routes
router.get('/:orderId', authenticate, requireUser, getOrderById);
router.put('/:orderId/cancel', authenticate, requireUser, cancelOrder);
router.put('/:orderId/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
