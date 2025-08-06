import express from 'express'
import { authenticate, requireAdmin, requireUser } from '../../common/middleware/auth'
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getCouponStats,
  generateCoupons
} from './coupon.controller'

const router = express.Router()

// Public routes (no authentication required)
router.post('/validate', validateCoupon)

// Admin routes (require admin authentication)
router.use(authenticate, requireAdmin)

// Coupon management routes
router.post('/', createCoupon)
router.get('/', getAllCoupons)
router.get('/stats', getCouponStats)
router.get('/generate', generateCoupons)
router.get('/:id', getCouponById)
router.put('/:id', updateCoupon)
router.delete('/:id', deleteCoupon)

// User routes (require user authentication)
router.post('/apply', authenticate, requireUser, applyCoupon)

export default router 