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
exports.generateCoupons = exports.getCouponStats = exports.applyCoupon = exports.validateCoupon = exports.deleteCoupon = exports.updateCoupon = exports.getCouponById = exports.getAllCoupons = exports.createCoupon = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const coupon_model_1 = require("./coupon.model");
const auth_model_1 = require("../auth/auth.model");
const order_model_1 = require("../orders/order.model");
// Generate a random coupon code
const generateCouponCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
// Check if coupon is applicable to the service/category
const checkCouponApplicability = (coupon, serviceType, category) => {
    // If coupon is applicable to all products/categories, it's valid
    if (coupon.applicableProducts.includes('all') && coupon.applicableCategories.includes('all')) {
        return true;
    }
    // Check service type applicability
    if (serviceType && coupon.applicableProducts.length > 0) {
        if (!coupon.applicableProducts.includes('all') && !coupon.applicableProducts.includes(serviceType)) {
            return false;
        }
    }
    // Check category applicability
    if (category && coupon.applicableCategories.length > 0) {
        if (!coupon.applicableCategories.includes('all') && !coupon.applicableCategories.includes(category)) {
            return false;
        }
    }
    return true;
};
// Create a new coupon (Admin only)
exports.createCoupon = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, discountType, discountValue, minimumAmount, maximumDiscount, validFrom, validUntil, usageLimit, applicableProducts, applicableCategories, userRestrictions, code } = req.body;
    // Generate code if not provided
    let couponCode = code;
    if (!couponCode) {
        let attempts = 0;
        const maxAttempts = 10;
        do {
            couponCode = generateCouponCode();
            attempts++;
            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to generate unique coupon code. Please try again.'
                });
            }
        } while (yield coupon_model_1.Coupon.findOne({ code: couponCode }));
    }
    else {
        // Check if code already exists - use case-insensitive search with proper error handling
        const existingCoupon = yield coupon_model_1.Coupon.findOne({
            code: { $regex: new RegExp(`^${couponCode.toUpperCase()}$`, 'i') }
        });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }
    }
    try {
        const coupon = yield coupon_model_1.Coupon.create({
            code: couponCode.toUpperCase(),
            name,
            description,
            discountType,
            discountValue,
            minimumAmount: minimumAmount || 0,
            maximumDiscount,
            validFrom: validFrom || new Date(),
            validUntil,
            usageLimit,
            applicableProducts: applicableProducts || ['all'],
            applicableCategories: applicableCategories || ['all'],
            userRestrictions: userRestrictions || {
                newUsersOnly: false,
                specificUsers: [],
                minimumOrders: 0
            },
            createdBy: req.user._id
        });
        res.status(201).json({
            success: true,
            data: { coupon }
        });
    }
    catch (error) {
        // Handle duplicate key error (race condition)
        if (error.code === 11000 || error.name === 'MongoServerError') {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists. Please try again.'
            });
        }
        throw error; // Re-throw other errors to be handled by asyncHandler
    }
}));
// Get all coupons (Admin only)
exports.getAllCoupons = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, search, status } = req.query;
    const query = {};
    if (search) {
        query.$or = [
            { code: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    if (status === 'active') {
        query.isActive = true;
        query.validFrom = { $lte: new Date() };
        query.validUntil = { $gte: new Date() };
    }
    else if (status === 'expired') {
        query.$or = [
            { validUntil: { $lt: new Date() } },
            { isActive: false }
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const coupons = yield coupon_model_1.Coupon.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    const total = yield coupon_model_1.Coupon.countDocuments(query);
    res.json({
        success: true,
        data: {
            coupons,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
}));
// Get coupon by ID (Admin only)
exports.getCouponById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('usageHistory.userId', 'name email')
        .populate('usageHistory.orderId', 'orderNumber totalAmount');
    if (!coupon) {
        return res.status(404).json({
            success: false,
            message: 'Coupon not found'
        });
    }
    res.json({
        success: true,
        data: { coupon }
    });
}));
// Update coupon (Admin only)
exports.updateCoupon = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, discountType, discountValue, minimumAmount, maximumDiscount, validFrom, validUntil, usageLimit, applicableProducts, applicableCategories, userRestrictions, isActive } = req.body;
    const coupon = yield coupon_model_1.Coupon.findById(req.params.id);
    if (!coupon) {
        return res.status(404).json({
            success: false,
            message: 'Coupon not found'
        });
    }
    // Check if code is being changed and if it already exists
    if (req.body.code && req.body.code !== coupon.code) {
        const existingCoupon = yield coupon_model_1.Coupon.findOne({
            code: { $regex: new RegExp(`^${req.body.code.toUpperCase()}$`, 'i') },
            _id: { $ne: req.params.id }
        });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }
    }
    const updatedCoupon = yield coupon_model_1.Coupon.findByIdAndUpdate(req.params.id, Object.assign({ name,
        description,
        discountType,
        discountValue,
        minimumAmount,
        maximumDiscount,
        validFrom,
        validUntil,
        usageLimit,
        applicableProducts,
        applicableCategories,
        userRestrictions,
        isActive }, (req.body.code && { code: req.body.code.toUpperCase() })), { new: true, runValidators: true }).populate('createdBy', 'name email');
    res.json({
        success: true,
        data: { coupon: updatedCoupon }
    });
}));
// Delete coupon (Admin only)
exports.deleteCoupon = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(req.params.id);
    if (!coupon) {
        return res.status(404).json({
            success: false,
            message: 'Coupon not found'
        });
    }
    // Check if coupon has been used
    if (coupon.usedCount > 0) {
        return res.status(400).json({
            success: false,
            message: 'Cannot delete coupon that has been used'
        });
    }
    yield coupon_model_1.Coupon.findByIdAndDelete(req.params.id);
    res.json({
        success: true,
        message: 'Coupon deleted successfully'
    });
}));
// Validate coupon code (Public)
exports.validateCoupon = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, orderAmount, userId, serviceType, category } = req.body;
    if (!code || !orderAmount) {
        return res.status(400).json({
            success: false,
            message: 'Coupon code and order amount are required'
        });
    }
    const coupon = yield coupon_model_1.Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
    });
    if (!coupon) {
        return res.status(404).json({
            success: false,
            message: 'Invalid coupon code'
        });
    }
    // Check if coupon is valid
    if (!coupon.isValid()) {
        return res.status(400).json({
            success: false,
            message: 'Coupon has expired or reached usage limit'
        });
    }
    // Check minimum amount
    if (orderAmount < coupon.minimumAmount) {
        return res.status(400).json({
            success: false,
            message: `Minimum order amount of ₹${coupon.minimumAmount} required`
        });
    }
    // Check if coupon is applicable to the service/category
    if (serviceType || category) {
        const isApplicable = checkCouponApplicability(coupon, serviceType, category);
        if (!isApplicable) {
            return res.status(400).json({
                success: false,
                message: 'This coupon is not applicable to the selected service'
            });
        }
    }
    // Check user restrictions if userId is provided
    if (userId) {
        const user = yield auth_model_1.User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        // Get user's order count
        const userOrderCount = yield order_model_1.Order.countDocuments({ userId });
        if (!coupon.canUserUse(userId, userOrderCount)) {
            return res.status(400).json({
                success: false,
                message: 'You are not eligible to use this coupon'
            });
        }
    }
    // Calculate discount
    const discount = coupon.calculateDiscount(orderAmount);
    const finalAmount = orderAmount - discount;
    res.json({
        success: true,
        data: {
            coupon: {
                id: coupon._id,
                code: coupon.code,
                name: coupon.name,
                description: coupon.description,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minimumAmount: coupon.minimumAmount,
                maximumDiscount: coupon.maximumDiscount
            },
            discount,
            finalAmount,
            originalAmount: orderAmount
        }
    });
}));
// Apply coupon to order (User)
exports.applyCoupon = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, orderId } = req.body;
    if (!code || !orderId) {
        return res.status(400).json({
            success: false,
            message: 'Coupon code and order ID are required'
        });
    }
    const coupon = yield coupon_model_1.Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true
    });
    if (!coupon) {
        return res.status(404).json({
            success: false,
            message: 'Invalid coupon code'
        });
    }
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }
    // Check if user owns the order
    if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to modify this order'
        });
    }
    // Check if coupon is valid
    if (!coupon.isValid()) {
        return res.status(400).json({
            success: false,
            message: 'Coupon has expired or reached usage limit'
        });
    }
    // Check minimum amount
    if (order.totalAmount < coupon.minimumAmount) {
        return res.status(400).json({
            success: false,
            message: `Minimum order amount of ₹${coupon.minimumAmount} required`
        });
    }
    // Get user's order count
    const userOrderCount = yield order_model_1.Order.countDocuments({ userId: req.user._id });
    // Check user restrictions
    if (!coupon.canUserUse(req.user._id.toString(), userOrderCount)) {
        return res.status(400).json({
            success: false,
            message: 'You are not eligible to use this coupon'
        });
    }
    // Calculate discount
    const discount = coupon.calculateDiscount(order.totalAmount);
    const finalAmount = order.totalAmount - discount;
    // Update order with coupon
    order.couponApplied = {
        couponId: coupon._id,
        code: coupon.code,
        discount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
    };
    order.finalAmount = finalAmount;
    yield order.save();
    // Update coupon usage
    coupon.usedCount += 1;
    coupon.usageHistory.push({
        userId: req.user._id,
        orderId: order._id,
        usedAt: new Date(),
        discountApplied: discount
    });
    yield coupon.save();
    res.json({
        success: true,
        data: {
            order,
            coupon: {
                id: coupon._id,
                code: coupon.code,
                name: coupon.name,
                discount,
                finalAmount
            }
        }
    });
}));
// Get coupon statistics (Admin only)
exports.getCouponStats = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalCoupons = yield coupon_model_1.Coupon.countDocuments();
    const activeCoupons = yield coupon_model_1.Coupon.countDocuments({
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
    });
    const expiredCoupons = yield coupon_model_1.Coupon.countDocuments({
        $or: [
            { validUntil: { $lt: new Date() } },
            { isActive: false }
        ]
    });
    // Get top used coupons
    const topUsedCoupons = yield coupon_model_1.Coupon.find()
        .sort({ usedCount: -1 })
        .limit(5)
        .select('code name usedCount usageLimit');
    // Get recent coupon usage
    const recentUsage = yield coupon_model_1.Coupon.aggregate([
        { $unwind: '$usageHistory' },
        { $sort: { 'usageHistory.usedAt': -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'users',
                localField: 'usageHistory.userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'orders',
                localField: 'usageHistory.orderId',
                foreignField: '_id',
                as: 'order'
            }
        },
        {
            $project: {
                code: 1,
                name: 1,
                'usageHistory.usedAt': 1,
                'usageHistory.discountApplied': 1,
                userName: { $arrayElemAt: ['$user.name', 0] },
                orderNumber: { $arrayElemAt: ['$order.orderNumber', 0] }
            }
        }
    ]);
    res.json({
        success: true,
        data: {
            stats: {
                totalCoupons,
                activeCoupons,
                expiredCoupons
            },
            topUsedCoupons,
            recentUsage
        }
    });
}));
// Generate multiple coupon codes (Admin only)
exports.generateCoupons = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { count = 1, prefix = '', length = 8 } = req.body;
    if (count > 100) {
        return res.status(400).json({
            success: false,
            message: 'Cannot generate more than 100 coupons at once'
        });
    }
    const generatedCodes = [];
    for (let i = 0; i < count; i++) {
        let code;
        do {
            code = prefix + generateCouponCode(length - prefix.length);
        } while (yield coupon_model_1.Coupon.findOne({ code }));
        generatedCodes.push(code);
    }
    res.json({
        success: true,
        data: { codes: generatedCodes }
    });
}));
