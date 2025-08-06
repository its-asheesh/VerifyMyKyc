import { Router } from 'express'
import {
  getCarouselSlides,
  getAllCarouselSlides,
  getCarouselSlideById,
  createCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
  toggleCarouselSlideStatus,
  reorderCarouselSlides
} from './carousel.controller'
import { authenticate, requireAdmin } from '../../common/middleware/auth'

const router = Router()

// Public routes (for client)
router.get('/', getCarouselSlides)

// Admin routes (protected)
router.get('/admin', authenticate, requireAdmin, getAllCarouselSlides)
router.get('/admin/:id', authenticate, requireAdmin, getCarouselSlideById)
router.post('/admin', authenticate, requireAdmin, createCarouselSlide)
router.put('/admin/:id', authenticate, requireAdmin, updateCarouselSlide)
router.delete('/admin/:id', authenticate, requireAdmin, deleteCarouselSlide)
router.patch('/admin/:id/toggle', authenticate, requireAdmin, toggleCarouselSlideStatus)
router.post('/admin/reorder', authenticate, requireAdmin, reorderCarouselSlides)

export default router 