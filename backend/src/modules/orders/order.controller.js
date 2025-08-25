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
exports.getOrderStats = exports.updateOrderStatus = exports.getAllOrders = exports.cancelOrder = exports.getActiveServices = exports.getOrderById = exports.getUserOrders = exports.processPayment = exports.createOrder = void 0;
const order_model_1 = require("./order.model");
const coupon_model_1 = require("../coupons/coupon.model");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const pricing_model_1 = require("../pricing/pricing.model");
// Create new order
exports.createOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderType, serviceName, serviceDetails, totalAmount, finalAmount, billingPeriod, paymentMethod, couponApplied } = req.body;
    console.log('Creating order with data:', {
        orderType,
        serviceName,
        serviceDetails,
        totalAmount,
        finalAmount,
        billingPeriod,
        paymentMethod,
        couponApplied
    });
    const userId = req.user._id;
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated orderId:', orderId);
    // Prepare verification quota if this is a verification order
    let verificationQuota = undefined;
    if (orderType === 'verification' && (serviceDetails === null || serviceDetails === void 0 ? void 0 : serviceDetails.verificationType)) {
        try {
            const pricing = yield pricing_model_1.VerificationPricing.findOne({ verificationType: serviceDetails.verificationType });
            if (pricing) {
                let quotaCfg;
                switch (billingPeriod) {
                    case 'monthly':
                        quotaCfg = pricing.monthlyQuota;
                        break;
                    case 'yearly':
                        quotaCfg = pricing.yearlyQuota;
                        break;
                    default:
                        quotaCfg = pricing.oneTimeQuota;
                }
                if (quotaCfg && typeof quotaCfg.count === 'number') {
                    verificationQuota = {
                        totalAllowed: quotaCfg.count,
                        used: 0,
                        remaining: quotaCfg.count,
                        validityDays: quotaCfg.validityDays || 0,
                    };
                }
            }
        }
        catch (e) {
            console.error('Failed to load verification pricing for quota initialization:', e);
        }
    }
    const orderData = {
        userId,
        orderId,
        orderType,
        serviceName,
        serviceDetails,
        totalAmount,
        finalAmount,
        billingPeriod,
        paymentMethod,
        paymentStatus: 'pending',
        startDate: new Date() // Add this to ensure startDate is set
    };
    if (verificationQuota) {
        orderData.verificationQuota = verificationQuota;
    }
    // Add coupon information if provided
    if (couponApplied) {
        orderData.couponApplied = couponApplied;
    }
    const order = yield order_model_1.Order.create(orderData);
    // Update coupon usage if a coupon was applied
    if (couponApplied && order) {
        try {
            const coupon = yield coupon_model_1.Coupon.findById(couponApplied.couponId);
            if (coupon) {
                coupon.usedCount += 1;
                coupon.usageHistory.push({
                    userId: req.user._id,
                    orderId: order._id,
                    usedAt: new Date(),
                    discountApplied: couponApplied.discount
                });
                yield coupon.save();
                console.log('Coupon usage updated successfully');
            }
        }
        catch (error) {
            console.error('Failed to update coupon usage:', error);
            // Don't fail order creation if coupon update fails
        }
    }
    console.log('Order created successfully:', order);
    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
    });
}));
// Process payment and activate order
exports.processPayment = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { orderId, transactionId } = req.body;
    const order = yield order_model_1.Order.findOne({ orderId, userId: req.user._id });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    if (order.paymentStatus === 'completed') {
        return res.status(400).json({ message: 'Payment already processed' });
    }
    // Update order with payment success
    order.paymentStatus = 'completed';
    order.transactionId = transactionId;
    order.status = 'active';
    order.startDate = new Date();
    // Recompute end date using quota validity if available, otherwise by billing period
    try {
        const start = order.startDate ? new Date(order.startDate) : new Date();
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
    }
    catch (err) {
        console.error('Failed to recompute endDate on payment:', err);
    }
    yield order.save();
    // If this is a plan purchase, auto-provision included verification quotas as separate verification orders
    try {
        if (order.orderType === 'plan' && order.paymentStatus === 'completed' && order.status === 'active') {
            const planType = (((_b = order.serviceDetails) === null || _b === void 0 ? void 0 : _b.planType) === 'monthly' || ((_c = order.serviceDetails) === null || _c === void 0 ? void 0 : _c.planType) === 'yearly')
                ? order.serviceDetails.planType
                : (order.billingPeriod === 'monthly' || order.billingPeriod === 'yearly') ? order.billingPeriod : 'monthly';
            const planName = (_d = order.serviceDetails) === null || _d === void 0 ? void 0 : _d.planName;
            if (planName) {
                const plan = yield pricing_model_1.HomepagePlan.findOne({ planType, planName });
                if (plan && Array.isArray(plan.includesVerifications) && plan.includesVerifications.length > 0) {
                    for (const vType of plan.includesVerifications) {
                        try {
                            // Lookup pricing for the included verification type to determine quota
                            const pricing = yield pricing_model_1.VerificationPricing.findOne({ verificationType: vType });
                            if (!pricing) {
                                console.warn(`processPayment: No pricing found for included verification type '${vType}'`);
                                continue;
                            }
                            const quotaCfg = planType === 'yearly' ? pricing.yearlyQuota : pricing.monthlyQuota;
                            if (!quotaCfg || typeof quotaCfg.count !== 'number' || quotaCfg.count <= 0) {
                                console.warn(`processPayment: No usable quota config for type '${vType}' under planType '${planType}'`);
                                continue;
                            }
                            // Create a child verification order representing the included quota for this verification type
                            const childOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                            yield order_model_1.Order.create({
                                userId: order.userId,
                                orderId: childOrderId,
                                orderType: 'verification',
                                serviceName: `${vType.toUpperCase()} Verification (Included in ${planName} ${planType})`,
                                serviceDetails: { verificationType: vType, features: ['Included via plan'] },
                                totalAmount: 0,
                                finalAmount: 0,
                                billingPeriod: planType,
                                paymentMethod: order.paymentMethod,
                                paymentStatus: 'completed',
                                status: 'active',
                                startDate: order.startDate || new Date(),
                                verificationQuota: {
                                    totalAllowed: quotaCfg.count,
                                    used: 0,
                                    remaining: quotaCfg.count,
                                    validityDays: quotaCfg.validityDays || (planType === 'monthly' ? 30 : 365),
                                },
                            });
                            console.log(`processPayment: Provisioned included '${vType}' verification quota from plan '${planName}'`);
                        }
                        catch (childErr) {
                            console.error('processPayment: Failed to create included verification order', { vType, planType, planName, err: childErr });
                        }
                    }
                }
                else {
                    console.log(`processPayment: Plan '${planName}' (${planType}) has no includesVerifications or plan not found`);
                }
            }
        }
    }
    catch (provisionErr) {
        console.error('processPayment: Error while provisioning included verification quotas for plan', provisionErr);
        // Do not fail the payment response due to provisioning errors
    }
    res.json({
        success: true,
        message: 'Payment processed successfully',
        data: { order }
    });
}));
// Get user's orders
exports.getUserOrders = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { status, orderType } = req.query;
    const filter = { userId };
    if (status)
        filter.status = status;
    if (orderType)
        filter.orderType = orderType;
    const orders = yield order_model_1.Order.find(filter)
        .sort({ createdAt: -1 })
        .populate('userId', 'name email');
    res.json({
        success: true,
        data: { orders }
    });
}));
// Get order by ID
exports.getOrderById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = yield order_model_1.Order.findOne({ orderId, userId })
        .populate('userId', 'name email');
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json({
        success: true,
        data: { order }
    });
}));
// Get user's active services
exports.getActiveServices = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const now = new Date();
    // Get all orders that were active and payment completed
    const orders = yield order_model_1.Order.find({
        userId,
        paymentStatus: 'completed'
    }).sort({ endDate: 1 });
    // Check and update expired orders
    const updatedOrders = [];
    for (const order of orders) {
        if (order.endDate && new Date(order.endDate) < now && order.status === 'active') {
            // Service has expired, update status
            order.status = 'expired';
            yield order.save();
            console.log(`Order ${order._id} marked as expired`);
        }
        updatedOrders.push(order);
    }
    // Filter for truly active services (not expired)
    const activeOrders = updatedOrders.filter(order => order.status === 'active' &&
        order.endDate &&
        new Date(order.endDate) >= now);
    // Group by order type
    const services = {
        verifications: activeOrders.filter(order => order.orderType === 'verification'),
        plans: activeOrders.filter(order => order.orderType === 'plan')
    };
    res.json({
        success: true,
        data: { services }
    });
}));
// Cancel order
exports.cancelOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = yield order_model_1.Order.findOne({ orderId, userId });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'cancelled') {
        return res.status(400).json({ message: 'Order already cancelled' });
    }
    order.status = 'cancelled';
    yield order.save();
    res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order }
    });
}));
// Admin: Get all orders
exports.getAllOrders = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, orderType, userId } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (orderType)
        filter.orderType = orderType;
    if (userId)
        filter.userId = userId;
    const orders = yield order_model_1.Order.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json({
        success: true,
        data: { orders }
    });
}));
// Admin: Update order status
exports.updateOrderStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = yield order_model_1.Order.findOne({ orderId });
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    yield order.save();
    res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
    });
}));
// Admin: Get order statistics
exports.getOrderStats = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalOrders = yield order_model_1.Order.countDocuments();
    const completedOrders = yield order_model_1.Order.countDocuments({ paymentStatus: 'completed' });
    const pendingOrders = yield order_model_1.Order.countDocuments({ paymentStatus: 'pending' });
    const activeOrders = yield order_model_1.Order.countDocuments({ status: 'active' });
    const expiredOrders = yield order_model_1.Order.countDocuments({ status: 'expired' });
    const totalRevenue = yield order_model_1.Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    res.json({
        success: true,
        data: {
            totalOrders,
            completedOrders,
            pendingOrders,
            activeOrders,
            expiredOrders,
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
        }
    });
}));
