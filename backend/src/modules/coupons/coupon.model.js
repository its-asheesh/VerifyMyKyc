"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const couponSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minimumAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    maximumDiscount: {
        type: Number,
        min: 0
    },
    validFrom: {
        type: Date,
        required: true,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        required: true,
        min: 1
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableProducts: [{
            type: String,
            default: ['all']
        }],
    applicableCategories: [{
            type: String,
            default: ['all']
        }],
    userRestrictions: {
        newUsersOnly: {
            type: Boolean,
            default: false
        },
        specificUsers: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }],
        minimumOrders: {
            type: Number,
            default: 0
        }
    },
    usageHistory: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            orderId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Order',
                required: true
            },
            usedAt: {
                type: Date,
                default: Date.now
            },
            discountApplied: {
                type: Number,
                required: true
            }
        }],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
// Index for efficient queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ 'usageHistory.userId': 1 });
// Pre-save middleware to validate coupon
couponSchema.pre('save', function (next) {
    const doc = this;
    // Ensure validUntil is after validFrom
    if (doc.validUntil <= doc.validFrom) {
        return next(new Error('Valid until date must be after valid from date'));
    }
    // Ensure maximum discount is set for percentage coupons
    if (doc.discountType === 'percentage' && !doc.maximumDiscount) {
        doc.maximumDiscount = doc.discountValue * 1000; // Default max discount
    }
    next();
});
// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return (this.isActive &&
        now >= this.validFrom &&
        now <= this.validUntil &&
        this.usedCount < this.usageLimit);
};
// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (orderAmount < this.minimumAmount) {
        return 0;
    }
    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (orderAmount * this.discountValue) / 100;
        if (this.maximumDiscount) {
            discount = Math.min(discount, this.maximumDiscount);
        }
    }
    else {
        discount = this.discountValue;
    }
    return Math.min(discount, orderAmount); // Can't discount more than order amount
};
// Method to check if user can use coupon
couponSchema.methods.canUserUse = function (userId, userOrderCount) {
    // Check if user is in specific users list
    if (this.userRestrictions.specificUsers.length > 0) {
        if (!this.userRestrictions.specificUsers.includes(userId)) {
            return false;
        }
    }
    // Check minimum orders requirement
    if (userOrderCount < this.userRestrictions.minimumOrders) {
        return false;
    }
    // Check if user has already used this coupon
    const hasUsed = this.usageHistory.some((usage) => usage.userId.toString() === userId);
    return !hasUsed;
};
exports.Coupon = mongoose_1.default.model('Coupon', couponSchema);
