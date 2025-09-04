import express from 'express'
import { authenticate, requireAdmin } from '../../common/middleware/auth'
import {
  getProductReviews,
  createReview,
  adminListReviews,
  adminUpdateReview,
  adminDeleteReview,
  getPublicReviews,
  adminSetVerified,
} from './review.controller'

const router = express.Router()

// Public: list approved reviews for a product
router.get('/product/:productId', getProductReviews)

// Public: list approved reviews across all products (all categories)
router.get('/public', getPublicReviews)

// Authenticated user: create a review
router.post('/', authenticate, createReview)

// Admin routes (apply middleware per-route to avoid affecting public endpoints)
router.get('/', authenticate, requireAdmin, adminListReviews)
router.put('/:id', authenticate, requireAdmin, adminUpdateReview)
router.delete('/:id', authenticate, requireAdmin, adminDeleteReview)
router.patch('/:id/verify', authenticate, requireAdmin, adminSetVerified)

export default router
