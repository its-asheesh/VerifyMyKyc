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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    orderType: {
        type: String,
        enum: ['verification', 'plan'],
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceDetails: {
        verificationType: String,
        planName: String,
        planType: {
            type: String,
            enum: ['monthly', 'yearly', 'one-time']
        },
        features: [String]
    },
    totalAmount: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    billingPeriod: {
        type: String,
        enum: ['one-time', 'monthly', 'yearly'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'netbanking'],
        required: true
    },
    transactionId: String,
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    verificationQuota: {
        totalAllowed: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 },
        validityDays: { type: Number, default: 0 },
        expiresAt: { type: Date }
    },
    couponApplied: {
        couponId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Coupon'
        },
        code: String,
        discount: Number,
        discountType: {
            type: String,
            enum: ['percentage', 'fixed']
        },
        discountValue: Number
    }
}, {
    timestamps: true
});
// Index for better query performance
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ endDate: 1 });
orderSchema.index({ 'couponApplied.couponId': 1 });
orderSchema.index({ 'verificationQuota.expiresAt': 1 });
// Generate order number
orderSchema.pre('save', function (next) {
    if (this.isNew && !this.orderNumber) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `ORD${timestamp}${random}`;
    }
    // Set final amount if not set (only if no coupon is applied)
    if (this.isNew && !this.finalAmount && !this.couponApplied) {
        this.finalAmount = this.totalAmount;
    }
    // Calculate end date based on quota validity or billing period
    if (this.isNew) {
        const startDate = this.startDate || new Date();
        let endDate = new Date(startDate);
        // If verification order has a quota validity, prefer that
        if (this.orderType === 'verification' && this.verificationQuota && this.verificationQuota.validityDays) {
            endDate.setDate(endDate.getDate() + this.verificationQuota.validityDays);
            this.verificationQuota.expiresAt = endDate;
        }
        else {
            // Fallback to billing period-based expiry
            switch (this.billingPeriod) {
                case 'one-time':
                    // One-time purchases are valid for 1 year
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                case 'monthly':
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 'yearly':
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
            }
        }
        this.endDate = endDate;
    }
    next();
});
// Method to check if order is expired
orderSchema.methods.isExpired = function () {
    return new Date() > this.endDate;
};
// Method to get remaining days
orderSchema.methods.getRemainingDays = function () {
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
};
// Method to get discount amount
orderSchema.methods.getDiscountAmount = function () {
    return this.totalAmount - this.finalAmount;
};
// Verification quota helpers
orderSchema.methods.canUseVerification = function () {
    if (this.orderType !== 'verification')
        return false;
    if (!this.verificationQuota)
        return false;
    const now = new Date();
    if (this.verificationQuota.expiresAt && now > this.verificationQuota.expiresAt)
        return false;
    return (this.verificationQuota.remaining || 0) > 0 && this.status === 'active';
};
orderSchema.methods.useVerification = function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.canUseVerification()) {
            throw new Error('Verification quota exhausted or expired');
        }
        this.verificationQuota.used = (this.verificationQuota.used || 0) + 1;
        const total = this.verificationQuota.totalAllowed || 0;
        this.verificationQuota.remaining = Math.max(0, total - this.verificationQuota.used);
        yield this.save();
    });
};
exports.Order = mongoose_1.default.model('Order', orderSchema);
