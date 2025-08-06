import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getUserStats,
  getUserLocationAnalytics,
  updateUserLocation,
  getUsersWithLocation
} from './auth.controller';
import { authenticate, requireAdmin, requireUser, requireAnyRole } from '../../common/middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticate, requireUser, getProfile);
router.put('/profile', authenticate, requireUser, updateProfile);
router.put('/change-password', authenticate, requireUser, changePassword);

// Admin-only routes
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.get('/users/stats', authenticate, requireAdmin, getUserStats);
router.get('/users/location-analytics', authenticate, requireAdmin, getUserLocationAnalytics);
router.get('/users/with-location', authenticate, requireAdmin, getUsersWithLocation);
router.put('/users/:userId/role', authenticate, requireAdmin, updateUserRole);
router.put('/users/:userId/toggle-status', authenticate, requireAdmin, toggleUserStatus);
router.put('/users/:userId/location', authenticate, requireAnyRole, updateUserLocation);

export default router; 