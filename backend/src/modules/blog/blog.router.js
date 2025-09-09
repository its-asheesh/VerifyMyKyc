"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../common/middleware/auth");
const blog_controller_1 = require("./blog.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/public', blog_controller_1.getPublicPosts);
router.get('/public/:slug', blog_controller_1.getPublicPostBySlug);
// Admin routes
router.get('/admin', auth_1.authenticate, auth_1.requireAdmin, blog_controller_1.adminListPosts);
router.get('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, blog_controller_1.adminGetPostById);
router.post('/admin', auth_1.authenticate, auth_1.requireAdmin, blog_controller_1.adminCreatePost);
router.put('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, blog_controller_1.adminUpdatePost);
router.delete('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, blog_controller_1.adminDeletePost);
router.patch('/admin/:id/toggle', auth_1.authenticate, auth_1.requireAdmin, blog_controller_1.adminTogglePostStatus);
exports.default = router;
