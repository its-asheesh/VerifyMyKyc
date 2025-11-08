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
  verifyUserEmail,
  verifyUserPhone,
  getUserStats,
  getUserLocationAnalytics,
  updateUserLocation,
  getUsersWithLocation,
  sendEmailOtp,
  verifyEmailOtp,
  sendPasswordResetOtp,
  resetPasswordWithOtp,
  resetPasswordWithPhoneToken,
  firebasePhoneRegister,
  firebasePhoneLogin,
  loginWithPhoneAndPassword
} from './auth.controller';
import { authenticate, requireAdmin, requireUser, requireAnyRole } from '../../common/middleware/auth';
import { validate } from '../../common/validation/middleware';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '../../common/validation/schemas';
import {
  authLimiter,
  otpLimiter,
  passwordResetLimiter,
  registerLimiter,
} from '../../common/middleware/rateLimiter';

const router = Router();

// Public routes with validation and rate limiting
router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/send-email-otp', otpLimiter, validate(sendOtpSchema), sendEmailOtp);
router.post('/verify-email-otp', otpLimiter, validate(verifyOtpSchema), verifyEmailOtp);
router.post('/password/send-otp', passwordResetLimiter, sendPasswordResetOtp);
router.post('/password/reset', passwordResetLimiter, validate(resetPasswordSchema), resetPasswordWithOtp);
router.post('/password/reset-phone', passwordResetLimiter, resetPasswordWithPhoneToken);
router.post('/logout', authLimiter, logout);

// Protected routes
router.get('/profile', authenticate, requireUser, getProfile);
router.put('/profile', authenticate, requireUser, updateProfile);
router.put('/change-password', authenticate, requireUser, validate(changePasswordSchema), changePassword);

// Admin-only routes
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.get('/users/stats', authenticate, requireAdmin, getUserStats);
router.get('/users/location-analytics', authenticate, requireAdmin, getUserLocationAnalytics);
router.get('/users/with-location', authenticate, requireAdmin, getUsersWithLocation);
router.put('/users/:userId/role', authenticate, requireAdmin, updateUserRole);
router.put('/users/:userId/toggle-status', authenticate, requireAdmin, toggleUserStatus);
router.put('/users/:userId/verify-email', authenticate, requireAdmin, verifyUserEmail);
router.put('/users/:userId/verify-phone', authenticate, requireAdmin, verifyUserPhone);
router.put('/users/:userId/location', authenticate, requireAnyRole, updateUserLocation);
router.post('/phone/register', registerLimiter, firebasePhoneRegister);
router.post('/phone/login', authLimiter, firebasePhoneLogin);
router.post('/login/phone-password', authLimiter, loginWithPhoneAndPassword);


export default router; 