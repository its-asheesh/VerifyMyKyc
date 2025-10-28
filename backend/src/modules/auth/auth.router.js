"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../common/middleware/auth");
const middleware_1 = require("../../common/validation/middleware");
const schemas_1 = require("../../common/validation/schemas");
const rateLimiter_1 = require("../../common/middleware/rateLimiter");
const router = (0, express_1.Router)();
// Public routes with validation and rate limiting
router.post('/register', rateLimiter_1.registerLimiter, (0, middleware_1.validate)(schemas_1.registerSchema), auth_controller_1.register);
router.post('/login', rateLimiter_1.authLimiter, (0, middleware_1.validate)(schemas_1.loginSchema), auth_controller_1.login);
router.post('/send-email-otp', rateLimiter_1.otpLimiter, (0, middleware_1.validate)(schemas_1.sendOtpSchema), auth_controller_1.sendEmailOtp);
router.post('/verify-email-otp', rateLimiter_1.otpLimiter, (0, middleware_1.validate)(schemas_1.verifyOtpSchema), auth_controller_1.verifyEmailOtp);
router.post('/password/send-otp', rateLimiter_1.passwordResetLimiter, auth_controller_1.sendPasswordResetOtp);
router.post('/password/reset', rateLimiter_1.passwordResetLimiter, (0, middleware_1.validate)(schemas_1.resetPasswordSchema), auth_controller_1.resetPasswordWithOtp);
router.post('/password/reset-phone', rateLimiter_1.passwordResetLimiter, auth_controller_1.resetPasswordWithPhoneToken);
router.post('/logout', rateLimiter_1.authLimiter, auth_controller_1.logout);
// Protected routes
router.get('/profile', auth_1.authenticate, auth_1.requireUser, auth_controller_1.getProfile);
router.put('/profile', auth_1.authenticate, auth_1.requireUser, auth_controller_1.updateProfile);
router.put('/change-password', auth_1.authenticate, auth_1.requireUser, (0, middleware_1.validate)(schemas_1.changePasswordSchema), auth_controller_1.changePassword);
// Admin-only routes
router.get('/users', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getAllUsers);
router.get('/users/stats', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getUserStats);
router.get('/users/location-analytics', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getUserLocationAnalytics);
router.get('/users/with-location', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getUsersWithLocation);
router.put('/users/:userId/role', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.updateUserRole);
router.put('/users/:userId/toggle-status', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.toggleUserStatus);
router.put('/users/:userId/location', auth_1.authenticate, auth_1.requireAnyRole, auth_controller_1.updateUserLocation);
router.post('/phone/register', rateLimiter_1.registerLimiter, auth_controller_1.firebasePhoneRegister);
router.post('/phone/login', rateLimiter_1.authLimiter, auth_controller_1.firebasePhoneLogin);
router.post('/login/phone-password', rateLimiter_1.authLimiter, auth_controller_1.loginWithPhoneAndPassword);
exports.default = router;
