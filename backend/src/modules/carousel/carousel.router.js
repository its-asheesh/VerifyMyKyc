"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carousel_controller_1 = require("./carousel.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
// Public routes (for client)
router.get('/', carousel_controller_1.getCarouselSlides);
// Admin routes (protected)
router.get('/admin', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.getAllCarouselSlides);
router.get('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.getCarouselSlideById);
router.post('/admin', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.createCarouselSlide);
router.put('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.updateCarouselSlide);
router.delete('/admin/:id', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.deleteCarouselSlide);
router.patch('/admin/:id/toggle', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.toggleCarouselSlideStatus);
router.post('/admin/reorder', auth_1.authenticate, auth_1.requireAdmin, carousel_controller_1.reorderCarouselSlides);
exports.default = router;
