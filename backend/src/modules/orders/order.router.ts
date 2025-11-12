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
  addProductsToUser,
} from './order.controller';
import { authenticate, requireAdmin, requireUser } from '../../common/middleware/auth';
// routes/order.routes.ts
import { verifyPayment } from './verifyPayment';


const router = Router();

// Admin routes (require admin role) - Must come before parameterized routes
router.post('/admin/add-products/:userId', authenticate, requireAdmin, addProductsToUser);
router.get('/stats/overview', authenticate, requireAdmin, getOrderStats);

// User routes (require authentication)
router.post('/', authenticate, requireUser, createOrder);
router.post('/process-payment', authenticate, requireUser, processPayment);
router.get('/my-orders', authenticate, requireUser, getUserOrders);
router.get('/my-services', authenticate, requireUser, getActiveServices);
router.post('/verify-payment', verifyPayment);

// Admin routes (require admin role)
router.get('/', authenticate, requireAdmin, getAllOrders);

// Parameterized routes - Must come after specific routes
router.get('/:orderId', authenticate, requireUser, getOrderById);
router.put('/:orderId/cancel', authenticate, requireUser, cancelOrder);
router.put('/:orderId/status', authenticate, requireAdmin, updateOrderStatus);

export default router; 