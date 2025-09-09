import { Router } from 'express'
import { authenticate, requireAdmin } from '../../common/middleware/auth'
import {
  getPublicPosts,
  getPublicPostBySlug,
  adminListPosts,
  adminGetPostById,
  adminCreatePost,
  adminUpdatePost,
  adminDeletePost,
  adminTogglePostStatus,
} from './blog.controller'

const router = Router()

// Public routes
router.get('/public', getPublicPosts)
router.get('/public/:slug', getPublicPostBySlug)

// Admin routes
router.get('/admin', authenticate, requireAdmin, adminListPosts)
router.get('/admin/:id', authenticate, requireAdmin, adminGetPostById)
router.post('/admin', authenticate, requireAdmin, adminCreatePost)
router.put('/admin/:id', authenticate, requireAdmin, adminUpdatePost)
router.delete('/admin/:id', authenticate, requireAdmin, adminDeletePost)
router.patch('/admin/:id/toggle', authenticate, requireAdmin, adminTogglePostStatus)

export default router
