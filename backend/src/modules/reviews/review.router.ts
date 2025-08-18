import express from 'express'
import { authenticate, requireAdmin } from '../../common/middleware/auth'
import {
  getProductReviews,
  createReview,
  adminListReviews,
  adminUpdateReview,
  adminDeleteReview,
} from './review.controller'

const router = express.Router()

// Public: list approved reviews for a product
router.get('/product/:productId', getProductReviews)

// Authenticated user: create a review
router.post('/', authenticate, createReview)

// Admin routes
router.use(authenticate, requireAdmin)
router.get('/', adminListReviews)
router.put('/:id', adminUpdateReview)
router.delete('/:id', adminDeleteReview)

export default router
