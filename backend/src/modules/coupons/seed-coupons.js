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
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_model_1 = require("./coupon.model");
const auth_model_1 = require("../auth/auth.model");
const seedCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get admin user for createdBy field
        const adminUser = yield auth_model_1.User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('No admin user found. Please create an admin user first.');
            return;
        }
        // Check if coupons already exist
        const existingCoupons = yield coupon_model_1.Coupon.countDocuments();
        if (existingCoupons > 0) {
            console.log('Coupons already seeded. Skipping...');
            return;
        }
        const sampleCoupons = [
            {
                code: 'WELCOME20',
                name: 'Welcome Discount',
                description: 'Get 20% off on your first order',
                discountType: 'percentage',
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
                    minimumOrders: 0
                },
                isActive: true,
                createdBy: adminUser._id
            },
            {
                code: 'SUMMER50',
                name: 'Summer Sale',
                description: 'Flat ₹50 off on orders above ₹200',
                discountType: 'fixed',
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
                    minimumOrders: 0
                },
                isActive: true,
                createdBy: adminUser._id
            },
            {
                code: 'PAN10',
                name: 'PAN Card Special',
                description: '10% off on PAN card verification',
                discountType: 'percentage',
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
                    minimumOrders: 0
                },
                isActive: true,
                createdBy: adminUser._id
            }
        ];
        yield coupon_model_1.Coupon.insertMany(sampleCoupons);
        console.log('✅ Sample coupons seeded successfully!');
        console.log('📋 Available coupon codes:');
        sampleCoupons.forEach(coupon => {
            console.log(`   • ${coupon.code} - ${coupon.name}`);
        });
    }
    catch (error) {
        console.error('❌ Error seeding coupons:', error);
    }
});
exports.default = seedCoupons;
