"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aadhaar_router_1 = __importDefault(require("./modules/aadhaar/aadhaar.router"));
const pan_router_1 = __importDefault(require("./modules/pan/pan.router"));
const gstin_router_1 = __importDefault(require("./modules/gstin/gstin.router"));
const mca_router_1 = __importDefault(require("./modules/mca/mca.router"));
const drivinglicense_router_1 = __importDefault(require("./modules/drivinglicense/drivinglicense.router"));
const echallan_router_1 = __importDefault(require("./modules/echallan/echallan.router"));
const pricing_router_1 = __importDefault(require("./modules/pricing/pricing.router"));
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
const order_router_1 = __importDefault(require("./modules/orders/order.router"));
const analytics_router_1 = __importDefault(require("./modules/analytics/analytics.router"));
const carousel_router_1 = __importDefault(require("./modules/carousel/carousel.router"));
const coupon_router_1 = __importDefault(require("./modules/coupons/coupon.router"));
const bankaccount_router_1 = __importDefault(require("./modules/bankaccount/bankaccount.router"));
const voter_router_1 = __importDefault(require("./modules/voter/voter.router"));
const router = (0, express_1.Router)();
// Auth routes
router.use('/auth', auth_router_1.default);
// Order routes
router.use('/orders', order_router_1.default);
// Analytics routes
router.use('/analytics', analytics_router_1.default);
// Carousel routes
router.use('/carousel', carousel_router_1.default);
// Coupon routes
router.use('/coupons', coupon_router_1.default);
// Other routes
router.use('/aadhaar', aadhaar_router_1.default);
router.use('/pan', pan_router_1.default);
router.use('/gstin', gstin_router_1.default);
router.use('/mca', mca_router_1.default);
router.use('/drivinglicense', drivinglicense_router_1.default);
router.use('/echallan', echallan_router_1.default);
router.use('/pricing', pricing_router_1.default);
router.use('/bankaccount', bankaccount_router_1.default);
router.use('/voter', voter_router_1.default);
exports.default = router;
