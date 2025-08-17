import mongoose, { Schema, Document } from "mongoose"

// Interface for individual verification pricing
export interface IVerificationPricing extends Document {
  verificationType: string // 'aadhaar', 'pan', 'drivinglicense', etc.
  monthlyPrice: number
  yearlyPrice: number
  oneTimePrice: number
  title?: string
  description?: string
  // Separate features for each pricing tier
  oneTimeFeatures?: string[]
  monthlyFeatures?: string[]
  yearlyFeatures?: string[]
  // Per-tier verification quotas
  oneTimeQuota?: { count: number; validityDays: number }
  monthlyQuota?: { count: number; validityDays: number }
  yearlyQuota?: { count: number; validityDays: number }
  highlighted?: boolean
  popular?: boolean
  color?: string
  createdAt: Date
  updatedAt: Date
}

// Interface for homepage plans
export interface IHomepagePlan extends Document {
  planType: 'monthly' | 'yearly'
  planName: 'Personal' | 'Professional' | 'Business' // New field for plan name
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
  color?: string
  includesVerifications: string[]
  createdAt: Date
  updatedAt: Date
}

// Individual verification pricing schema
const VerificationPricingSchema = new Schema<IVerificationPricing>(
  {
    verificationType: { type: String, required: true, unique: true },
    monthlyPrice: { type: Number, required: true },
    yearlyPrice: { type: Number, required: true },
    oneTimePrice: { type: Number, required: true },
    title: { type: String },
    description: { type: String },
    // Separate features for each pricing tier
    oneTimeFeatures: { type: [String], default: [] },
    monthlyFeatures: { type: [String], default: [] },
    yearlyFeatures: { type: [String], default: [] },
    // Per-tier verification quotas
    oneTimeQuota: {
      count: { type: Number, default: 0 },
      validityDays: { type: Number, default: 365 }
    },
    monthlyQuota: {
      count: { type: Number, default: 0 },
      validityDays: { type: Number, default: 30 }
    },
    yearlyQuota: {
      count: { type: Number, default: 0 },
      validityDays: { type: Number, default: 365 }
    },
    highlighted: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    color: { type: String },
  },
  { timestamps: true }
)

// Homepage plans schema
const HomepagePlanSchema = new Schema<IHomepagePlan>(
  {
    planType: { type: String, required: true, enum: ['monthly', 'yearly'] },
    planName: { type: String, required: true, enum: ['Personal', 'Professional', 'Business'] },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    highlighted: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    color: { type: String },
    includesVerifications: { type: [String], required: true },
  },
  { timestamps: true }
)

// Create compound index for homepage plans to ensure unique planType + planName combination
HomepagePlanSchema.index({ planType: 1, planName: 1 }, { unique: true })

export const VerificationPricing = mongoose.model<IVerificationPricing>("VerificationPricing", VerificationPricingSchema)
export const HomepagePlan = mongoose.model<IHomepagePlan>("HomepagePlan", HomepagePlanSchema)
 