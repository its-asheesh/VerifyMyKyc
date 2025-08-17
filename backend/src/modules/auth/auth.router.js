"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
// Protected routes
router.get('/profile', auth_1.authenticate, auth_1.requireUser, auth_controller_1.getProfile);
router.put('/profile', auth_1.authenticate, auth_1.requireUser, auth_controller_1.updateProfile);
router.put('/change-password', auth_1.authenticate, auth_1.requireUser, auth_controller_1.changePassword);
// Admin-only routes
router.get('/users', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getAllUsers);
router.get('/users/stats', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getUserStats);
router.get('/users/location-analytics', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getUserLocationAnalytics);
router.get('/users/with-location', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.getUsersWithLocation);
router.put('/users/:userId/role', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.updateUserRole);
router.put('/users/:userId/toggle-status', auth_1.authenticate, auth_1.requireAdmin, auth_controller_1.toggleUserStatus);
router.put('/users/:userId/location', auth_1.authenticate, auth_1.requireAnyRole, auth_controller_1.updateUserLocation);
exports.default = router;
