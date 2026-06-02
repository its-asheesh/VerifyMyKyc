// // backend/routes/paymentRoutes.ts
// import { Router } from 'express'
// import { createRazorpayOrder, verifyPayment, updateOrderAfterPayment } from './paymentController'
// import { authenticateJWT } from '../../common/utils/jwt'
// const razorpayRoutes = require('./razorpayRoutes');

// const router = Router()

// router.post('/create-order', authenticateJWT, createRazorpayOrder)
// router.post('/verify-payment', authenticateJWT, verifyPayment)
// router.post('/payment-success', authenticateJWT, updateOrderAfterPayment)
// router.use('/razorpay', razorpayRoutes);

// export default router
