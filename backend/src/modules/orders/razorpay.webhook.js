"use strict";
// Razorpay Webhook Handler
// This handles payment events from Razorpay, especially important for QR code payments
// where users might not return to the frontend after payment
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
exports.handleRazorpayWebhook = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const crypto_1 = __importDefault(require("crypto"));
const order_model_1 = require("./order.model");
const razorpay_1 = require("../../common/services/razorpay");
exports.handleRazorpayWebhook = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Get the webhook signature from headers
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (!webhookSignature || !webhookSecret) {
        console.error('Razorpay webhook: Missing signature or secret');
        return res.status(400).json({ error: 'Missing webhook signature or secret' });
    }
    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto_1.default
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
    if (expectedSignature !== webhookSignature) {
        console.error('Razorpay webhook: Invalid signature');
        return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    const event = req.body.event;
    const payload = req.body.payload;
    console.log(`Razorpay webhook received: ${event}`, {
        paymentId: (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.payment) === null || _a === void 0 ? void 0 : _a.entity) === null || _b === void 0 ? void 0 : _b.id,
        orderId: (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.payment) === null || _c === void 0 ? void 0 : _c.entity) === null || _d === void 0 ? void 0 : _d.order_id
    });
    // Handle payment success events
    if (event === 'payment.captured' || event === 'payment.authorized') {
        const payment = (_e = payload === null || payload === void 0 ? void 0 : payload.payment) === null || _e === void 0 ? void 0 : _e.entity;
        if (!payment) {
            console.error('Razorpay webhook: Missing payment entity');
            return res.status(400).json({ error: 'Missing payment entity' });
        }
        const razorpayPaymentId = payment.id;
        const razorpayOrderId = payment.order_id;
        const paymentStatus = payment.status;
        // Only process if payment is captured/authorized
        if (paymentStatus !== 'captured' && paymentStatus !== 'authorized') {
            console.log(`Razorpay webhook: Payment not captured/authorized, status: ${paymentStatus}`);
            return res.status(200).json({ received: true });
        }
        try {
            // Fetch payment details from Razorpay to get the full order details
            const razorpayPayment = yield razorpay_1.razorpay.payments.fetch(razorpayPaymentId);
            const paymentAmountPaise = Number(razorpayPayment.amount);
            const paymentAmount = paymentAmountPaise / 100; // Razorpay amounts are returned in paise
            if (Number.isNaN(paymentAmountPaise)) {
                console.error(`Razorpay webhook: Invalid payment amount for ${razorpayPaymentId}`);
                return res.status(200).json({ received: true, message: 'Invalid payment amount' });
            }
            // Find order by Razorpay order ID (stored in order.razorpayOrderId or similar)
            // We need to check if we store razorpayOrderId in the order
            let order = yield order_model_1.Order.findOne({
                $or: [
                    { transactionId: razorpayPaymentId },
                    { 'razorpayOrderId': razorpayOrderId }
                ],
                paymentStatus: 'pending'
            });
            // If not found by razorpayOrderId, try to find by matching the amount and recent creation
            if (!order && razorpayPayment.order_id) {
                // Try to find by amount and recent date (within last hour)
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                const orders = yield order_model_1.Order.find({
                    paymentStatus: 'pending',
                    finalAmount: paymentAmount, // Razorpay amounts are in paise
                    createdAt: { $gte: oneHourAgo }
                }).sort({ createdAt: -1 });
                // Match by amount (with small tolerance) and currency
                order = orders.find(o => Math.abs(o.finalAmount - paymentAmount) < 1 &&
                    o.currency === razorpayPayment.currency) || null;
            }
            if (!order) {
                console.error(`Razorpay webhook: Order not found for payment ${razorpayPaymentId}`);
                // Still return 200 to prevent Razorpay from retrying
                return res.status(200).json({ received: true, message: 'Order not found' });
            }
            // Update order status
            order.paymentStatus = 'completed';
            order.transactionId = razorpayPaymentId;
            order.status = 'active';
            order.startDate = new Date();
            // Store Razorpay order ID for future reference
            if (!order.razorpayOrderId) {
                order.razorpayOrderId = razorpayOrderId;
            }
            // Recalculate endDate
            const start = new Date(order.startDate);
            let newEnd = new Date(start);
            if (order.orderType === 'verification' && ((_f = order.verificationQuota) === null || _f === void 0 ? void 0 : _f.validityDays)) {
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
            // If it's a plan, auto-provision included verifications
            if (order.orderType === 'plan' && order.status === 'active') {
                const planType = ((_g = order.serviceDetails) === null || _g === void 0 ? void 0 : _g.planType) || order.billingPeriod;
                const planName = (_h = order.serviceDetails) === null || _h === void 0 ? void 0 : _h.planName;
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
                            // Check if child order already exists
                            const existingChild = yield order_model_1.Order.findOne({
                                userId: order.userId,
                                orderType: 'verification',
                                'serviceDetails.verificationType': vType,
                                paymentStatus: 'completed',
                                status: 'active',
                                createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Within last 5 minutes
                            });
                            if (existingChild)
                                continue; // Already provisioned
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
            console.log(`Razorpay webhook: Order ${order.orderId} activated successfully`);
            return res.status(200).json({ received: true, orderId: order.orderId });
        }
        catch (error) {
            console.error('Razorpay webhook: Error processing payment:', error);
            // Return 200 to prevent Razorpay from retrying, but log the error
            return res.status(200).json({ received: true, error: error.message });
        }
    }
    // Handle payment failure events
    if (event === 'payment.failed') {
        const payment = (_j = payload === null || payload === void 0 ? void 0 : payload.payment) === null || _j === void 0 ? void 0 : _j.entity;
        if (payment) {
            const razorpayPaymentId = payment.id;
            // Find and mark order as failed
            const order = yield order_model_1.Order.findOne({
                $or: [
                    { transactionId: razorpayPaymentId },
                    { 'razorpayOrderId': payment.order_id }
                ],
                paymentStatus: 'pending'
            });
            if (order) {
                order.paymentStatus = 'failed';
                yield order.save();
                console.log(`Razorpay webhook: Order ${order.orderId} marked as failed`);
            }
        }
    }
    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
}));
