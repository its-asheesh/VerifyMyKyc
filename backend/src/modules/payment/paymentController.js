"use strict";
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
exports.updateOrderAfterPayment = exports.verifyPayment = exports.createRazorpayOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const payment_1 = require("../../config/payment");
const order_model_1 = require("../orders/order.model"); // assuming you have an Order model
const razorpay = new razorpay_1.default({
    key_id: payment_1.razorpayConfig.key_id,
    key_secret: payment_1.razorpayConfig.key_secret
});
// Create Razorpay Order
// Add debug logging to createRazorpayOrder
const createRazorpayOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency = 'INR', receipt } = req.body;
    console.log('🔍 Creating Razorpay order:', { amount, currency, receipt });
    if (!payment_1.razorpayConfig.key_id || !payment_1.razorpayConfig.key_secret) {
        console.error('❌ Razorpay credentials missing:', {
            key_id: payment_1.razorpayConfig.key_id ? 'SET' : 'MISSING',
            key_secret: payment_1.razorpayConfig.key_secret ? 'SET' : 'MISSING'
        });
        return res.status(500).json({
            success: false,
            message: 'Razorpay credentials not configured'
        });
    }
    try {
        const options = {
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };
        const order = yield razorpay.orders.create(options);
        console.log('✅ Razorpay order created:', order.id);
        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error('❌ Razorpay order creation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
});
exports.createRazorpayOrder = createRazorpayOrder;
// Verify Payment Signature (important for security)
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', payment_1.razorpayConfig.key_secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
    if (expectedSignature === razorpay_signature) {
        // ✅ Payment is verified
        return res.status(200).json({ success: true, message: 'Payment verified' });
    }
    else {
        return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
});
exports.verifyPayment = verifyPayment;
// After verification, update order status
const updateOrderAfterPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, paymentId, signature } = req.body;
    try {
        // Verify payment first
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', payment_1.razorpayConfig.key_secret)
            .update(orderId + '|' + paymentId)
            .digest('hex');
        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
        // Update order in DB
        const order = yield order_model_1.Order.findOneAndUpdate({ orderId }, {
            paymentId,
            signature,
            status: 'paid',
            updatedAt: new Date()
        }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ success: false, message: 'Failed to update order' });
    }
});
exports.updateOrderAfterPayment = updateOrderAfterPayment;
