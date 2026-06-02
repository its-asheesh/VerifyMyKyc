import dotenv from 'dotenv';
import { connectDB } from '../../config/db';
import { VerificationPricing, HomepagePlan } from './pricing.model';

// Load environment variables
dotenv.config();

const seedPricingData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await VerificationPricing.deleteMany({});
    await HomepagePlan.deleteMany({});

    // Seed verification pricing
    const verificationPricingData = [
      {
        verificationType: 'aadhaar',
        oneTimePrice: 99,
        title: 'Aadhaar Verification',
        description: 'Complete Aadhaar verification services',
        oneTimeFeatures: ['OCR Data Extraction', 'Basic Verification', 'Email Support'],
        highlighted: true,
        popular: true,
        color: 'blue',
      },
      {
        verificationType: 'pan',
        oneTimePrice: 79,
        title: 'PAN Verification',
        description: 'Comprehensive PAN verification services',
        oneTimeFeatures: ['PAN Data Validation', 'Basic Verification', 'Email Support'],
        highlighted: false,
        popular: true,
        color: 'green',
      },
      {
        verificationType: 'drivinglicense',
        oneTimePrice: 89,
        title: 'Driving License Verification',
        description: 'Driving license verification and OCR services',
        oneTimeFeatures: ['OCR Data Extraction', 'Basic Verification', 'Email Support'],
        highlighted: false,
        popular: false,
        color: 'purple',
      },
      {
        verificationType: 'gstin',
        oneTimePrice: 69,
        title: 'GSTIN Verification',
        description: 'GSTIN verification and business data services',
        oneTimeFeatures: ['GSTIN Validation', 'Basic Business Details', 'Email Support'],
        highlighted: false,
        popular: false,
        color: 'orange',
      },
      {
        verificationType: 'voterid',
        oneTimePrice: 99,
        title: 'Voter ID Verification',
        description: 'Voter verification with direct, captcha, and OCR flows',
        oneTimeFeatures: [
          'Direct Fetch (Boson)',
          'Captcha Flow (Meson)',
          'OCR Data Extraction',
          'Email Support',
        ],
        // Quotas for display in UI
        oneTimeQuota: { count: 1, validityDays: 30 },
        highlighted: false,
        popular: true,
        color: 'indigo',
      },
      {
        verificationType: 'company',
        oneTimePrice: 149,
        title: 'Company Verification',
        description: 'MCA company verification with CIN and DIN lookups',
        oneTimeFeatures: [
          'MCA Company Details',
          'CIN Lookup',
          'Directors (DIN) Lookup',
          'Email Support',
        ],
        oneTimeQuota: { count: 1, validityDays: 30 },
        highlighted: false,
        popular: false,
        color: 'emerald',
      },
      {
        verificationType: 'vehicle',
        oneTimePrice: 99,
        title: 'RC Verification',
        description: 'Vehicle RC, eChallan and FASTag verification',
        oneTimeFeatures: ['Fetch RC Lite', 'Basic Verification', 'Email Support'],
        oneTimeQuota: { count: 10, validityDays: 30 },
        highlighted: false,
        popular: true,
        color: 'cyan',
      },
      {
        verificationType: 'ccrv',
        oneTimePrice: 199,
        title: 'Criminal Case Record Verification',
        description: 'Comprehensive criminal background check and case record verification',
        oneTimeFeatures: [
          'Generate CCRV Report',
          'Search CCRV Records',
          'Fetch Verification Results',
          'Email Support',
        ],
        // Quotas for display in UI
        oneTimeQuota: { count: 1, validityDays: 30 },
        highlighted: false,
        popular: true,
        color: 'indigo',
      },
      {
        verificationType: 'epfo',
        oneTimePrice: 149,
        title: 'EPFO Verification',
        description: 'EPFO UAN, employment history, and passbook verification',
        oneTimeFeatures: [
          'Fetch UAN by Mobile/PAN',
          'Employment History by UAN',
          'Employer Verification',
        ],
        highlighted: false,
        popular: true,
        color: 'rose',
      },
    ];

    await VerificationPricing.insertMany(verificationPricingData);
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
          'Live Chat Support',
        ],
        highlighted: false,
        popular: false,
        color: 'blue',
        includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin', 'rc'],
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
          '2 Months Free',
        ],
        highlighted: false,
        popular: false,
        color: 'blue',
        includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin', 'rc'],
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
          'Advanced Analytics',
        ],
        highlighted: false,
        popular: true,
        color: 'purple',
        includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin', 'rc'],
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
          '2 Months Free',
        ],
        highlighted: false,
        popular: true,
        color: 'purple',
        includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin', 'rc'],
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
          'Custom Integrations',
        ],
        highlighted: true,
        popular: false,
        color: 'green',
        includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin', 'rc'],
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
          '2 Months Free',
        ],
        highlighted: true,
        popular: false,
        color: 'green',
        includesVerifications: ['aadhaar', 'pan', 'drivinglicense', 'gstin', 'rc'],
      },
    ];

    await HomepagePlan.insertMany(homepagePlansData);
    console.log('✅ Homepage plans seeded successfully');

    console.log('🎉 All pricing data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pricing data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedPricingData();
