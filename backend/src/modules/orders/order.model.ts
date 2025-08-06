import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: string;
  orderNumber: string;
  orderType: 'verification' | 'plan';
  serviceName: string;
  serviceDetails: {
    verificationType?: string;
    planName?: string;
    planType?: 'monthly' | 'yearly' | 'one-time';
    features?: string[];
  };
  totalAmount: number;
  finalAmount: number;
  currency: string;
  billingPeriod: 'one-time' | 'monthly' | 'yearly';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'netbanking';
  transactionId?: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  couponApplied?: {
    couponId: mongoose.Types.ObjectId;
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
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
  couponApplied: {
    couponId: {
      type: Schema.Types.ObjectId,
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

// Generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
  }
  
  // Set final amount if not set (only if no coupon is applied)
  if (this.isNew && !this.finalAmount && !this.couponApplied) {
    this.finalAmount = this.totalAmount;
  }
  
  // Calculate end date based on billing period
  if (this.isNew) {
    const startDate = this.startDate || new Date();
    let endDate = new Date(startDate);
    
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
    
    this.endDate = endDate;
  }
  next();
});

// Method to check if order is expired
orderSchema.methods.isExpired = function(): boolean {
  return new Date() > this.endDate;
};

// Method to get remaining days
orderSchema.methods.getRemainingDays = function(): number {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Method to get discount amount
orderSchema.methods.getDiscountAmount = function(): number {
  return this.totalAmount - this.finalAmount;
};

export const Order = mongoose.model<IOrder>('Order', orderSchema); 