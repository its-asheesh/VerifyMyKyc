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
// routes/order.routes.ts
import { verifyPayment } from './verifyPayment';


const router = Router();

// User routes (require authentication)
router.post('/', authenticate, requireUser, createOrder);
router.post('/process-payment', authenticate, requireUser, processPayment);
router.get('/my-orders', authenticate, requireUser, getUserOrders);
router.get('/my-services', authenticate, requireUser, getActiveServices);
router.get('/:orderId', authenticate, requireUser, getOrderById);
router.put('/:orderId/cancel', authenticate, requireUser, cancelOrder);
router.post('/verify-payment', verifyPayment);

// Admin routes (require admin role)
router.get('/', authenticate, requireAdmin, getAllOrders);
router.put('/:orderId/status', authenticate, requireAdmin, updateOrderStatus);
router.get('/stats/overview', authenticate, requireAdmin, getOrderStats);

export default router; 