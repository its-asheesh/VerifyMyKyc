const mongoose = require('mongoose');
require('dotenv').config();

// Define coupon schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minimumAmount: { type: Number, default: 0 },
  maximumDiscount: { type: Number },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  applicableProducts: { type: [String], default: ['all'] },
  applicableCategories: { type: [String], default: ['all'] },
  userRestrictions: {
    newUsersOnly: { type: Boolean, default: false },
    specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    minimumOrders: { type: Number, default: 0 }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

const checkCoupon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    const coupon = await Coupon.findOne({ code: 'PAN10' }).lean();
    if (coupon) {
      console.log('PAN10 Coupon Details:');
      console.log(JSON.stringify(coupon, null, 2));
    } else {
      console.log('PAN10 coupon not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkCoupon(); 