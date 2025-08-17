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
exports.HomepagePlan = exports.VerificationPricing = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Individual verification pricing schema
const VerificationPricingSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Homepage plans schema
const HomepagePlanSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Create compound index for homepage plans to ensure unique planType + planName combination
HomepagePlanSchema.index({ planType: 1, planName: 1 }, { unique: true });
exports.VerificationPricing = mongoose_1.default.model("VerificationPricing", VerificationPricingSchema);
exports.HomepagePlan = mongoose_1.default.model("HomepagePlan", HomepagePlanSchema);
