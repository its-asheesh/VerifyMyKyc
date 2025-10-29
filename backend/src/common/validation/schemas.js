"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentSchema = exports.cinByPanSchema = exports.epfoValidateOtpSchema = exports.epfoGenerateOtpSchema = exports.epfoFetchUanSchema = exports.bankAccountVerifySchema = exports.voterBosonFetchSchema = exports.voterOcrSchema = exports.drivingLicenseSchema = exports.gstinByPanSchema = exports.gstinFetchSchema = exports.gstinSchema = exports.aadhaarSubmitOtpV2Schema = exports.aadhaarGenerateOtpV2Schema = exports.aadhaarNumberSchema = exports.aadhaarOcrV1Schema = exports.panAadhaarLinkSchema = exports.panFatherNameSchema = exports.panNumberSchema = exports.verifyOtpSchema = exports.sendOtpSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = exports.envSchema = void 0;
const zod_1 = require("zod");
// Environment Variables Schema
exports.envSchema = zod_1.z.object({
    // MongoDB
    MONGO_URI: zod_1.z.string().url('MONGO_URI must be a valid URL'),
    // JWT
    JWT_SECRET: zod_1.z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    // Gridlines API
    GRIDLINES_BASE_URL: zod_1.z.string().url('GRIDLINES_BASE_URL must be a valid URL'),
    GRIDLINES_API_KEY: zod_1.z.string().min(1, 'GRIDLINES_API_KEY is required'),
    // Node Environment
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().regex(/^\d+$/).optional(),
    // Razorpay
    RAZORPAY_KEY_ID: zod_1.z.string().optional(),
    RAZORPAY_KEY_SECRET: zod_1.z.string().optional(),
    // Firebase
    FIREBASE_PROJECT_ID: zod_1.z.string().optional(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().optional(),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().optional(),
    // QuickEKYC API
    QUICKEKYC_API_KEY: zod_1.z.string().optional(),
    QUICKEKYC_BASE_URL: zod_1.z.string().url().optional(),
});
// Auth Schemas
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim(),
    email: zod_1.z.string()
        .email('Invalid email address')
        .optional()
        .or(zod_1.z.literal('')),
    phone: zod_1.z.string()
        .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
        .optional()
        .or(zod_1.z.literal('')),
    password: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password cannot exceed 128 characters'),
    company: zod_1.z.string()
        .max(100, 'Company name cannot exceed 100 characters')
        .optional(),
    location: zod_1.z.object({
        country: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        region: zod_1.z.string().optional(),
        timezone: zod_1.z.string().optional(),
        ipAddress: zod_1.z.string().optional(),
    }).optional(),
}).refine((data) => data.email || data.phone, {
    message: 'Either email or phone number is required',
    path: ['email'],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, 'Email or phone is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
    location: zod_1.z.object({
        country: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        region: zod_1.z.string().optional(),
        timezone: zod_1.z.string().optional(),
        ipAddress: zod_1.z.string().optional(),
    }).optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password cannot exceed 128 characters'),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits'),
    newPassword: zod_1.z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password cannot exceed 128 characters'),
});
exports.sendOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').optional(),
    phone: zod_1.z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
}).refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').optional(),
    phone: zod_1.z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits'),
}).refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
});
// PAN Schemas
exports.panNumberSchema = zod_1.z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format')
    .transform((val) => val.toUpperCase());
exports.panFatherNameSchema = zod_1.z.object({
    pan_number: exports.panNumberSchema,
    consent: zod_1.z.enum(['Y', 'N']).refine((val) => val === 'Y' || val === 'N', { message: 'Consent must be Y or N' }),
});
exports.panAadhaarLinkSchema = zod_1.z.object({
    pan_number: exports.panNumberSchema,
    aadhaar_number: zod_1.z.string()
        .regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits'),
    consent: zod_1.z.enum(['Y', 'N']),
});
// Aadhaar Schemas
exports.aadhaarOcrV1Schema = zod_1.z.object({
    base64_data: zod_1.z.string()
        .min(1, 'Base64 data is required')
        .refine((val) => {
        try {
            // Basic base64 validation
            const matches = val.match(/^data:image\/(png|jpg|jpeg);base64,/);
            return matches !== null;
        }
        catch (_a) {
            return false;
        }
    }, { message: 'Invalid base64 image format' }),
    consent: zod_1.z.enum(['Y', 'N']),
});
// Aadhaar V2 Schemas (QuickEKYC)
exports.aadhaarNumberSchema = zod_1.z.string()
    .regex(/^[0-9]{12}$/, 'Aadhaar number must be exactly 12 digits')
    .transform((val) => val.trim());
exports.aadhaarGenerateOtpV2Schema = zod_1.z.object({
    id_number: exports.aadhaarNumberSchema,
    consent: zod_1.z.enum(['Y', 'N']).optional(), // Consent handled in controller
});
exports.aadhaarSubmitOtpV2Schema = zod_1.z.object({
    request_id: zod_1.z.union([
        zod_1.z.string().min(1, 'Request ID is required'),
        zod_1.z.number().positive('Request ID must be positive')
    ]).transform((val) => String(val)),
    otp: zod_1.z.string()
        .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
    client_id: zod_1.z.string().optional(),
    consent: zod_1.z.enum(['Y', 'N']).optional(), // Consent handled in controller
});
// GSTIN Schemas
exports.gstinSchema = zod_1.z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .transform((val) => val.toUpperCase());
exports.gstinFetchSchema = zod_1.z.object({
    gstin: exports.gstinSchema,
});
exports.gstinByPanSchema = zod_1.z.object({
    pan_number: exports.panNumberSchema,
    consent: zod_1.z.enum(['Y', 'N']),
});
// Driving License Schemas
exports.drivingLicenseSchema = zod_1.z.object({
    dl_number: zod_1.z.string().min(1, 'Driving license number is required'),
    dob: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
    consent: zod_1.z.enum(['Y', 'N']),
});
// Voter ID Schemas
exports.voterOcrSchema = zod_1.z.object({
    consent: zod_1.z.enum(['Y', 'N']),
});
// Voter Fetch Schemas
exports.voterBosonFetchSchema = zod_1.z.object({
    epi_number: zod_1.z.string().min(1, 'EPIC number is required'),
});
// Bank Account Schemas
exports.bankAccountVerifySchema = zod_1.z.object({
    account_number: zod_1.z.string().min(9, 'Account number must be at least 9 digits'),
    ifsc: zod_1.z.string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    consent: zod_1.z.enum(['Y', 'N']),
});
// EPFO Schemas
exports.epfoFetchUanSchema = zod_1.z.object({
    aadhaar_number: zod_1.z.string().regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits'),
    consent: zod_1.z.enum(['Y', 'N']),
});
exports.epfoGenerateOtpSchema = zod_1.z.object({
    uan: zod_1.z.string().min(12, 'UAN must be at least 12 digits'),
    consent: zod_1.z.enum(['Y', 'N']),
});
exports.epfoValidateOtpSchema = zod_1.z.object({
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits'),
});
// MCA Schemas
exports.cinByPanSchema = zod_1.z.object({
    pan_number: exports.panNumberSchema,
    consent: zod_1.z.enum(['Y', 'N']),
});
// Common Schemas
exports.consentSchema = zod_1.z.enum(['Y', 'N']).refine((val) => val === 'Y' || val === 'N', { message: 'Consent must be Y or N' });
