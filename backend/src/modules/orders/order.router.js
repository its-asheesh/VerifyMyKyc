"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../common/middleware/auth");
// routes/order.routes.ts
const verifyPayment_1 = require("./verifyPayment");
const razorpay_webhook_1 = require("./razorpay.webhook");
const router = (0, express_1.Router)();
// Admin routes (require admin role) - Must come before parameterized routes
router.get('/stats/overview', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.getOrderStats);
// Razorpay webhook (no auth required - uses signature verification)
router.post('/razorpay-webhook', razorpay_webhook_1.handleRazorpayWebhook);
// User routes (require authentication)
router.post('/', auth_1.authenticate, auth_1.requireUser, order_controller_1.createOrder);
router.post('/process-payment', auth_1.authenticate, auth_1.requireUser, order_controller_1.processPayment);
router.get('/my-orders', auth_1.authenticate, auth_1.requireUser, order_controller_1.getUserOrders);
router.get('/my-services', auth_1.authenticate, auth_1.requireUser, order_controller_1.getActiveServices);
router.post('/verify-payment', verifyPayment_1.verifyPayment);
// Admin routes (require admin role)
router.get('/', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.getAllOrders);
// Parameterized routes - Must come after specific routes
router.get('/:orderId', auth_1.authenticate, auth_1.requireUser, order_controller_1.getOrderById);
router.put('/:orderId/cancel', auth_1.authenticate, auth_1.requireUser, order_controller_1.cancelOrder);
router.put('/:orderId/status', auth_1.authenticate, auth_1.requireAdmin, order_controller_1.updateOrderStatus);
exports.default = router;
