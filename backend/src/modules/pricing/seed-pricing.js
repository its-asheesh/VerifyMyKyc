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
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../../config/db");
const pricing_model_1 = require("./pricing.model");
// Load environment variables
dotenv_1.default.config();
const seedPricingData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)();
        // Clear existing data
        yield pricing_model_1.VerificationPricing.deleteMany({});
        yield pricing_model_1.HomepagePlan.deleteMany({});
        // Seed verification pricing
        const verificationPricingData = [
            {
                verificationType: 'aadhaar',
                monthlyPrice: 299,
                yearlyPrice: 2999,
                oneTimePrice: 99,
                title: 'Aadhaar Verification',
                description: 'Complete Aadhaar verification services',
                oneTimeFeatures: [
                    'OCR Data Extraction',
                    'Basic Verification',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'OCR Data Extraction',
                    'Digilocker Integration',
                    'Real-time Verification',
                    'API Access',
                    'Priority Support',
                    'Bulk Processing'
                ],
                yearlyFeatures: [
                    'OCR Data Extraction',
                    'Digilocker Integration',
                    'Real-time Verification',
                    'API Access',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                highlighted: true,
                popular: true,
                color: 'blue'
            },
            {
                verificationType: 'pan',
                monthlyPrice: 199,
                yearlyPrice: 1999,
                oneTimePrice: 79,
                title: 'PAN Verification',
                description: 'Comprehensive PAN verification services',
                oneTimeFeatures: [
                    'PAN Data Validation',
                    'Basic Verification',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'PAN Data Validation',
                    'Digilocker Pull',
                    'Father Name Fetch',
                    'API Access',
                    'Priority Support',
                    'Bulk Processing'
                ],
                yearlyFeatures: [
                    'PAN Data Validation',
                    'Digilocker Pull',
                    'Father Name Fetch',
                    'API Access',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                highlighted: false,
                popular: true,
                color: 'green'
            },
            {
                verificationType: 'drivinglicense',
                monthlyPrice: 249,
                yearlyPrice: 2499,
                oneTimePrice: 89,
                title: 'Driving License Verification',
                description: 'Driving license verification and OCR services',
                oneTimeFeatures: [
                    'OCR Data Extraction',
                    'Basic Verification',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'OCR Data Extraction',
                    'RTA Database Check',
                    'Document Validation',
                    'API Access',
                    'Priority Support',
                    'Bulk Processing'
                ],
                yearlyFeatures: [
                    'OCR Data Extraction',
                    'RTA Database Check',
                    'Document Validation',
                    'API Access',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                highlighted: false,
                popular: false,
                color: 'purple'
            },
            {
                verificationType: 'gstin',
                monthlyPrice: 179,
                yearlyPrice: 1799,
                oneTimePrice: 69,
                title: 'GSTIN Verification',
                description: 'GSTIN verification and business data services',
                oneTimeFeatures: [
                    'GSTIN Validation',
                    'Basic Business Details',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'GSTIN Validation',
                    'Business Details',
                    'Contact Information',
                    'API Access',
                    'Priority Support',
                    'Bulk Processing'
                ],
                yearlyFeatures: [
                    'GSTIN Validation',
                    'Business Details',
                    'Contact Information',
                    'API Access',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                highlighted: false,
                popular: false,
                color: 'orange'
            },
            {
                verificationType: 'voterid',
                monthlyPrice: 349,
                yearlyPrice: 3499,
                oneTimePrice: 99,
                title: 'Voter ID Verification',
                description: 'Voter verification with direct, captcha, and OCR flows',
                oneTimeFeatures: [
                    'Direct Fetch (Boson)',
                    'Captcha Flow (Meson)',
                    'OCR Data Extraction',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'Direct Fetch (Boson)',
                    'Captcha Flow (Meson)',
                    'OCR Data Extraction',
                    'API Access',
                    'Priority Support',
                    'Bulk Processing'
                ],
                yearlyFeatures: [
                    'Direct Fetch (Boson)',
                    'Captcha Flow (Meson)',
                    'OCR Data Extraction',
                    'API Access',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                // Quotas for display in UI
                oneTimeQuota: { count: 1, validityDays: 30 },
                monthlyQuota: { count: 100, validityDays: 30 },
                yearlyQuota: { count: 1200, validityDays: 365 },
                highlighted: false,
                popular: true,
                color: 'indigo'
            },
            {
                verificationType: 'company',
                monthlyPrice: 499,
                yearlyPrice: 4999,
                oneTimePrice: 149,
                title: 'Company Verification',
                description: 'MCA company verification with CIN and DIN lookups',
                oneTimeFeatures: [
                    'MCA Company Details',
                    'CIN Lookup',
                    'Directors (DIN) Lookup',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'MCA Company Details',
                    'CIN Lookup',
                    'Directors (DIN) Lookup',
                    'API Access',
                    'Priority Support',
                    'Bulk Processing'
                ],
                yearlyFeatures: [
                    'MCA Company Details',
                    'CIN Lookup',
                    'Directors (DIN) Lookup',
                    'API Access',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                oneTimeQuota: { count: 1, validityDays: 30 },
                monthlyQuota: { count: 200, validityDays: 30 },
                yearlyQuota: { count: 2400, validityDays: 365 },
                highlighted: false,
                popular: false,
                color: 'emerald'
            },
            {
                verificationType: 'rc',
                monthlyPrice: 399,
                yearlyPrice: 3999,
                oneTimePrice: 99,
                title: 'RC Verification',
                description: 'Vehicle RC, eChallan and FASTag verification',
                oneTimeFeatures: [
                    'Fetch RC Lite',
                    'Basic Verification',
                    'Email Support'
                ],
                monthlyFeatures: [
                    'RC Detailed + Challan',
                    'Chassis-to-RC Lookup',
                    'FASTag Details',
                    'API Access',
                    'Priority Support',
                    'Quota-aware Billing'
                ],
                yearlyFeatures: [
                    'All Monthly Features',
                    '24/7 Support',
                    'Bulk Processing',
                    'Custom Integration',
                    'Dedicated Account Manager'
                ],
                oneTimeQuota: { count: 10, validityDays: 30 },
                monthlyQuota: { count: 500, validityDays: 30 },
                yearlyQuota: { count: 5000, validityDays: 365 },
                highlighted: false,
                popular: true,
                color: 'cyan'
            }
        ];
        yield pricing_model_1.VerificationPricing.insertMany(verificationPricingData);
        console.log('✅ Verification pricing seeded successfully');
        // Seed homepage plans
        const homepagePlansData = [
            // Personal Plans
            {
                planType: 'monthly',
                planName: 'Personal',
                name: 'Personal Monthly',
                price: 190,
                description: 'Perfect for individuals getting started',
                features: [
                    'Full Access to VerifyMyKyc',
                    '100 GB Free Storage',
                    'Unlimited Visitors',
                    '10 Agents',
                    'Live Chat Support'
                ],
                highlighted: false,
                popular: false,
                color: 'blue',
                includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin']
            },
            {
                planType: 'yearly',
                planName: 'Personal',
                name: 'Personal Yearly',
                price: 1938, // 190 * 12 * 0.85 (15% discount)
                description: 'Perfect for individuals getting started (Save 15%)',
                features: [
                    'Full Access to VerifyMyKyc',
                    '100 GB Free Storage',
                    'Unlimited Visitors',
                    '10 Agents',
                    'Live Chat Support',
                    '2 Months Free'
                ],
                highlighted: false,
                popular: false,
                color: 'blue',
                includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin']
            },
            // Professional Plans
            {
                planType: 'monthly',
                planName: 'Professional',
                name: 'Professional Monthly',
                price: 495,
                description: 'Best for growing businesses',
                features: [
                    'Full Access to VerifyMyKyc',
                    '500 GB Free Storage',
                    'Unlimited Visitors',
                    '50 Agents',
                    'Priority Live Chat Support',
                    'Advanced Analytics'
                ],
                highlighted: false,
                popular: true,
                color: 'purple',
                includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin']
            },
            {
                planType: 'yearly',
                planName: 'Professional',
                name: 'Professional Yearly',
                price: 5049, // 495 * 12 * 0.85 (15% discount)
                description: 'Best for growing businesses (Save 15%)',
                features: [
                    'Full Access to VerifyMyKyc',
                    '500 GB Free Storage',
                    'Unlimited Visitors',
                    '50 Agents',
                    'Priority Live Chat Support',
                    'Advanced Analytics',
                    '2 Months Free'
                ],
                highlighted: false,
                popular: true,
                color: 'purple',
                includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin']
            },
            // Business Plans
            {
                planType: 'monthly',
                planName: 'Business',
                name: 'Business Monthly',
                price: 998,
                description: 'For large scale operations',
                features: [
                    'Full Access to VerifyMyKyc',
                    'Unlimited Storage',
                    'Unlimited Visitors',
                    'Unlimited Agents',
                    '24/7 Priority Support',
                    'Advanced Analytics',
                    'Custom Integrations'
                ],
                highlighted: true,
                popular: false,
                color: 'green',
                includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin']
            },
            {
                planType: 'yearly',
                planName: 'Business',
                name: 'Business Yearly',
                price: 10180, // 998 * 12 * 0.85 (15% discount)
                description: 'For large scale operations (Save 15%)',
                features: [
                    'Full Access to VerifyMyKyc',
                    'Unlimited Storage',
                    'Unlimited Visitors',
                    'Unlimited Agents',
                    '24/7 Priority Support',
                    'Advanced Analytics',
                    'Custom Integrations',
                    '2 Months Free'
                ],
                highlighted: true,
                popular: false,
                color: 'green',
                includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin']
            }
        ];
        yield pricing_model_1.HomepagePlan.insertMany(homepagePlansData);
        console.log('✅ Homepage plans seeded successfully');
        console.log('🎉 All pricing data seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding pricing data:', error);
        process.exit(1);
    }
});
// Run the seed function
seedPricingData();
