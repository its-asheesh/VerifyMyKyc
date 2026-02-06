import mongoose from 'mongoose';
import { Coupon } from './coupon.model';
import { User } from '../auth/auth.model';

const seedCoupons = async () => {
  try {
    // Get admin user for createdBy field
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    // Check if coupons already exist
    const existingCoupons = await Coupon.countDocuments();
    if (existingCoupons > 0) {
      console.log('Coupons already seeded. Skipping...');
      return;
    }

    const sampleCoupons = [
      {
        code: 'WELCOME20',
        name: 'Welcome Discount',
        description: 'Get 20% off on your first order',
        discountType: 'percentage' as const,
        discountValue: 20,
        minimumAmount: 100,
        maximumDiscount: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: 1000,
        applicableProducts: ['all'],
        applicableCategories: ['all'],
        userRestrictions: {
          newUsersOnly: true,
          specificUsers: [],
          minimumOrders: 0,
        },
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        code: 'SUMMER50',
        name: 'Summer Sale',
        description: 'Flat ₹50 off on orders above ₹200',
        discountType: 'fixed' as const,
        discountValue: 50,
        minimumAmount: 200,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
        usageLimit: 500,
        applicableProducts: ['all'],
        applicableCategories: ['all'],
        userRestrictions: {
          newUsersOnly: false,
          specificUsers: [],
          minimumOrders: 0,
        },
        isActive: true,
        createdBy: adminUser._id,
      },
      {
        code: 'PAN10',
        name: 'PAN Card Special',
        description: '10% off on PAN card verification',
        discountType: 'percentage' as const,
        discountValue: 10,
        minimumAmount: 50,
        maximumDiscount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        usageLimit: 200,
        applicableProducts: ['pan'],
        applicableCategories: ['personal'],
        userRestrictions: {
          newUsersOnly: false,
          specificUsers: [],
          minimumOrders: 0,
        },
        isActive: true,
        createdBy: adminUser._id,
      },
    ];

    await Coupon.insertMany(sampleCoupons);
    console.log('✅ Sample coupons seeded successfully!');
    console.log('📋 Available coupon codes:');
    sampleCoupons.forEach((coupon) => {
      console.log(`   • ${coupon.code} - ${coupon.name}`);
    });
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
  }
};

export default seedCoupons;
