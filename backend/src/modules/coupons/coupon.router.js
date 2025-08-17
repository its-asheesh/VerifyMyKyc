"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../common/middleware/auth");
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
// Public routes (no authentication required)
router.post('/validate', coupon_controller_1.validateCoupon);
// Admin routes (require admin authentication)
router.use(auth_1.authenticate, auth_1.requireAdmin);
// Coupon management routes
router.post('/', coupon_controller_1.createCoupon);
router.get('/', coupon_controller_1.getAllCoupons);
router.get('/stats', coupon_controller_1.getCouponStats);
router.get('/generate', coupon_controller_1.generateCoupons);
router.get('/:id', coupon_controller_1.getCouponById);
router.put('/:id', coupon_controller_1.updateCoupon);
router.delete('/:id', coupon_controller_1.deleteCoupon);
// User routes (require user authentication)
router.post('/apply', auth_1.authenticate, auth_1.requireUser, coupon_controller_1.applyCoupon);
exports.default = router;
