import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maximumDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableProducts: string[]; // Product IDs or 'all'
  applicableCategories: string[]; // Category IDs or 'all'
  userRestrictions: {
    newUsersOnly: boolean;
    specificUsers: string[]; // User IDs
    minimumOrders: number;
  };
  usageHistory: Array<{
    userId: string;
    orderId: string;
    usedAt: Date;
    discountApplied: number;
  }>;
  createdBy: string; // Admin ID
  createdAt: Date;
  updatedAt: Date;
  // Add method signatures
  isValid(): boolean;
  calculateDiscount(orderAmount: number): number;
  canUserUse(userId: string, userOrderCount: number): boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    maximumDiscount: {
      type: Number,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableProducts: [
      {
        type: String,
        default: ['all'],
      },
    ],
    applicableCategories: [
      {
        type: String,
        default: ['all'],
      },
    ],
    userRestrictions: {
      newUsersOnly: {
        type: Boolean,
        default: false,
      },
      specificUsers: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      minimumOrders: {
        type: Number,
        default: 0,
      },
    },
    usageHistory: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        orderId: {
          type: Schema.Types.ObjectId,
          ref: 'Order',
          required: true,
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        discountApplied: {
          type: Number,
          required: true,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ 'usageHistory.userId': 1 });

// Pre-save middleware to validate coupon
couponSchema.pre('save', function (next) {
  const doc = this as any;
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
couponSchema.methods.isValid = function (this: ICoupon): boolean {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    this.usedCount < this.usageLimit
  );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (this: ICoupon, orderAmount: number): number {
  if (orderAmount < this.minimumAmount) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maximumDiscount) {
      discount = Math.min(discount, this.maximumDiscount);
    }
  } else {
    discount = this.discountValue;
  }

  return Math.min(discount, orderAmount); // Can't discount more than order amount
};

// Method to check if user can use coupon
couponSchema.methods.canUserUse = function (
  this: ICoupon,
  userId: string,
  userOrderCount: number,
): boolean {
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
  const hasUsed = this.usageHistory.some((usage: any) => usage.userId.toString() === userId);
  return !hasUsed;
};

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
