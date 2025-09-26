// src/routes/auth.routes.ts
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

// 🔹 NEW: Add the new auth methods
import {
  firebaseAuth,
  sendOtp,
  verifyOtp,
  checkEmail
} from './auth.controller'; // ← your new controller (or merge into auth.controller)

import { authenticate, requireAdmin, requireUser, requireAnyRole } from '../../common/middleware/auth';

const router = Router();

// ─── Public Routes ───────────────────────────────
router.post('/register', register);               // Traditional (email + password)
router.post('/login', login);                     // Traditional login
router.post('/logout', logout);

// 🔹 NEW Auth Methods (Public)
router.post('/auth/firebase', firebaseAuth);      // Google + Mobile (Firebase ID token)
router.post('/auth/send-otp', sendOtp);           // Email OTP
router.post('/auth/verify-otp', verifyOtp);       // Verify email OTP + login
router.get('/auth/check-email', checkEmail);      // For UI

// ─── Protected Routes ────────────────────────────
router.get('/profile', authenticate, requireUser, getProfile);
router.put('/profile', authenticate, requireUser, updateProfile);
router.put('/change-password', authenticate, requireUser, changePassword);

// ─── Admin Routes ────────────────────────────────
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.get('/users/stats', authenticate, requireAdmin, getUserStats);
router.get('/users/location-analytics', authenticate, requireAdmin, getUserLocationAnalytics);
router.get('/users/with-location', authenticate, requireAdmin, getUsersWithLocation);
router.put('/users/:userId/role', authenticate, requireAdmin, updateUserRole);
router.put('/users/:userId/toggle-status', authenticate, requireAdmin, toggleUserStatus);
router.put('/users/:userId/location', authenticate, requireAnyRole, updateUserLocation);

export default router;