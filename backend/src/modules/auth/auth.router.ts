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
  addUserTokens,
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
  loginWithPhoneAndPassword,
} from './auth.controller';
import {
  authenticate,
  requireAdmin,
  requireUser,
  requireAnyRole,
} from '../../common/middleware/auth';
import { validate } from '../../common/validation/middleware';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from '../../common/validation/schemas';

const router = Router();

// Public routes with validation
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/send-email-otp', validate(sendOtpSchema), sendEmailOtp);
router.post('/verify-email-otp', validate(verifyOtpSchema), verifyEmailOtp);
router.post('/password/send-otp', sendPasswordResetOtp);
router.post('/password/reset', validate(resetPasswordSchema), resetPasswordWithOtp);
router.post('/password/reset-phone', resetPasswordWithPhoneToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticate, requireUser, getProfile);
router.put('/profile', authenticate, requireUser, updateProfile);
router.put(
  '/change-password',
  authenticate,
  requireUser,
  validate(changePasswordSchema),
  changePassword,
);

// Admin-only routes
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.get('/users/stats', authenticate, requireAdmin, getUserStats);
router.get('/users/location-analytics', authenticate, requireAdmin, getUserLocationAnalytics);
router.get('/users/with-location', authenticate, requireAdmin, getUsersWithLocation);
router.put('/users/:userId/role', authenticate, requireAdmin, updateUserRole);
router.put('/users/:userId/toggle-status', authenticate, requireAdmin, toggleUserStatus);
router.put('/users/:userId/verify-email', authenticate, requireAdmin, verifyUserEmail);
router.put('/users/:userId/verify-phone', authenticate, requireAdmin, verifyUserPhone);
router.post('/users/:userId/add-tokens', authenticate, requireAdmin, addUserTokens);
router.put('/users/:userId/location', authenticate, requireAnyRole, updateUserLocation);
router.post('/phone/register', firebasePhoneRegister);
router.post('/phone/login', firebasePhoneLogin);
router.post('/login/phone-password', loginWithPhoneAndPassword);

export default router;
