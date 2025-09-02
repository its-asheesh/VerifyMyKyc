"use strict";
// controllers/order/verifyPayment.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const order_model_1 = require("./order.model"); // Adjust path as needed
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const crypto_1 = __importDefault(require("crypto"));
exports.verifyPayment = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
        return res.status(400).json({
            success: false,
            message: 'Missing required payment details'
        });
    }
    // Verify Razorpay signature
    const generatedSignature = crypto_1.default
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: 'Invalid payment signature'
        });
    }
    // Find your internal order
    const order = yield order_model_1.Order.findOne({ orderId, paymentStatus: 'pending' });
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found or already processed'
        });
    }
    // Activate the order
    order.paymentStatus = 'completed';
    order.transactionId = razorpay_payment_id;
    order.status = 'active';
    order.startDate = new Date();
    // Recalculate endDate
    const start = new Date(order.startDate);
    let newEnd = new Date(start);
    if (order.orderType === 'verification' && ((_a = order.verificationQuota) === null || _a === void 0 ? void 0 : _a.validityDays)) {
        newEnd.setDate(newEnd.getDate() + order.verificationQuota.validityDays);
        order.endDate = newEnd;
        if (order.verificationQuota) {
            order.verificationQuota.expiresAt = newEnd;
        }
    }
    else {
        switch (order.billingPeriod) {
            case 'one-time':
                newEnd.setFullYear(newEnd.getFullYear() + 1);
                break;
            case 'monthly':
                newEnd.setMonth(newEnd.getMonth() + 1);
                break;
            case 'yearly':
                newEnd.setFullYear(newEnd.getFullYear() + 1);
                break;
        }
        order.endDate = newEnd;
    }
    yield order.save();
    // 🔁 If it's a plan, auto-provision included verifications (same logic as processPayment)
    try {
        if (order.orderType === 'plan' && order.status === 'active') {
            const planType = ((_b = order.serviceDetails) === null || _b === void 0 ? void 0 : _b.planType) || order.billingPeriod;
            const planName = (_c = order.serviceDetails) === null || _c === void 0 ? void 0 : _c.planName;
            if (planName) {
                const { HomepagePlan } = yield Promise.resolve().then(() => __importStar(require('../pricing/pricing.model')));
                const plan = yield HomepagePlan.findOne({ planType, planName });
                if (plan && Array.isArray(plan.includesVerifications)) {
                    const { VerificationPricing } = yield Promise.resolve().then(() => __importStar(require('../pricing/pricing.model')));
                    for (const vType of plan.includesVerifications) {
                        const pricing = yield VerificationPricing.findOne({ verificationType: vType });
                        if (!pricing)
                            continue;
                        const quotaCfg = planType === 'yearly' ? pricing.yearlyQuota : pricing.monthlyQuota;
                        if (!quotaCfg || typeof quotaCfg.count !== 'number' || quotaCfg.count <= 0)
                            continue;
                        const childOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        yield order_model_1.Order.create({
                            userId: order.userId,
                            orderId: childOrderId,
                            orderType: 'verification',
                            serviceName: `${vType.toUpperCase()} Verification (Included in ${planName})`,
                            serviceDetails: { verificationType: vType },
                            totalAmount: 0,
                            finalAmount: 0,
                            billingPeriod: planType,
                            paymentMethod: order.paymentMethod,
                            paymentStatus: 'completed',
                            status: 'active',
                            startDate: order.startDate,
                            endDate: order.endDate,
                            verificationQuota: {
                                totalAllowed: quotaCfg.count,
                                used: 0,
                                remaining: quotaCfg.count,
                                validityDays: quotaCfg.validityDays || (planType === 'monthly' ? 30 : 365),
                                expiresAt: order.endDate
                            }
                        });
                    }
                }
            }
        }
    }
    catch (err) {
        console.error('Error provisioning plan verifications:', err);
    }
    res.json({
        success: true,
        message: 'Payment verified and order activated',
        data: { order }
    });
}));
