import { z } from 'zod';

// Environment Variables Schema
export const envSchema = z.object({
  // MongoDB
  MONGO_URI: z.string().url('MONGO_URI must be a valid URL'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  
  // Gridlines API
  GRIDLINES_BASE_URL: z.string().url('GRIDLINES_BASE_URL must be a valid URL'),
  GRIDLINES_API_KEY: z.string().min(1, 'GRIDLINES_API_KEY is required'),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).optional(),
  
  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  
  // Firebase
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  
  // QuickEKYC API
  QUICKEKYC_API_KEY: z.string().optional(),
  QUICKEKYC_BASE_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

// Auth Schemas
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  company: z.string()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional(),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    timezone: z.string().optional(),
    ipAddress: z.string().optional(),
  }).optional(),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Either email or phone number is required',
    path: ['email'],
  }
);

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    timezone: z.string().optional(),
    ipAddress: z.string().optional(),
  }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters'),
});

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Either email or phone is required',
    path: ['email'],
  }
);

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
}).refine(
  (data) => data.email || data.phone,
  {
    message: 'Either email or phone is required',
    path: ['email'],
  }
);

// PAN Schemas
export const panNumberSchema = z.string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format')
  .transform((val) => val.toUpperCase());

export const panFatherNameSchema = z.object({
  pan_number: panNumberSchema,
  consent: z.enum(['Y', 'N']).refine(
    (val) => val === 'Y' || val === 'N',
    { message: 'Consent must be Y or N' }
  ),
});

export const panAadhaarLinkSchema = z.object({
  pan_number: panNumberSchema,
  aadhaar_number: z.string()
    .regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits'),
  consent: z.enum(['Y', 'N']),
});

// Aadhaar Schemas
export const aadhaarOcrV1Schema = z.object({
  base64_data: z.string()
    .min(1, 'Base64 data is required')
    .refine(
      (val) => {
        try {
          // Basic base64 validation
          const matches = val.match(/^data:image\/(png|jpg|jpeg);base64,/);
          return matches !== null;
        } catch {
          return false;
        }
      },
      { message: 'Invalid base64 image format' }
    ),
  consent: z.enum(['Y', 'N']),
});

// Aadhaar V2 Schemas (QuickEKYC)
export const aadhaarNumberSchema = z.string()
  .regex(/^[0-9]{12}$/, 'Aadhaar number must be exactly 12 digits')
  .transform((val) => val.trim());

export const aadhaarGenerateOtpV2Schema = z.object({
  id_number: aadhaarNumberSchema,
  consent: z.enum(['Y', 'N']).optional(), // Consent handled in controller
});

export const aadhaarSubmitOtpV2Schema = z.object({
  request_id: z.union([
    z.string().min(1, 'Request ID is required'),
    z.number().positive('Request ID must be positive')
  ]).transform((val) => String(val)),
  otp: z.string()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  client_id: z.string().optional(),
  consent: z.enum(['Y', 'N']).optional(), // Consent handled in controller
});

// GSTIN Schemas
export const gstinSchema = z.string()
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Invalid GSTIN format'
  )
  .transform((val) => val.toUpperCase());

export const gstinFetchSchema = z.object({
  gstin: gstinSchema,
});

export const gstinByPanSchema = z.object({
  pan_number: panNumberSchema,
  consent: z.enum(['Y', 'N']),
});

// Driving License Schemas
export const drivingLicenseSchema = z.object({
  dl_number: z.string().min(1, 'Driving license number is required'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
  consent: z.enum(['Y', 'N']),
});

// Voter ID Schemas
export const voterOcrSchema = z.object({
  consent: z.enum(['Y', 'N']),
});

// Voter Fetch Schemas
export const voterBosonFetchSchema = z.object({
  epi_number: z.string().min(1, 'EPIC number is required'),
});

// Bank Account Schemas
export const bankAccountVerifySchema = z.object({
  account_number: z.string().min(9, 'Account number must be at least 9 digits'),
  ifsc: z.string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  consent: z.enum(['Y', 'N']),
});

// EPFO Schemas
export const epfoFetchUanSchema = z.object({
  aadhaar_number: z.string().regex(/^[0-9]{12}$/, 'Aadhaar must be 12 digits'),
  consent: z.enum(['Y', 'N']),
});

export const epfoGenerateOtpSchema = z.object({
  uan: z.string().min(12, 'UAN must be at least 12 digits'),
  consent: z.enum(['Y', 'N']),
});

export const epfoValidateOtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// MCA Schemas
export const cinByPanSchema = z.object({
  pan_number: panNumberSchema,
  consent: z.enum(['Y', 'N']),
});

// Common Schemas
export const consentSchema = z.enum(['Y', 'N']).refine(
  (val) => val === 'Y' || val === 'N',
  { message: 'Consent must be Y or N' }
);

