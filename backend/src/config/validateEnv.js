"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvironmentOrThrow = exports.validateEnvironment = void 0;
// Environment variable validation for critical backend configuration
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
/**
 * Validates that all required environment variables are present
 * Categorizes issues into errors (critical) and warnings (optional)
 */
const validateEnvironment = () => {
    const errors = [];
    const warnings = [];
    // Critical variables - application will not function without these
    const criticalVars = {
        MONGO_URI: process.env.MONGO_URI,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
        GRIDLINES_BASE_URL: process.env.GRIDLINES_BASE_URL,
        GRIDLINES_API_KEY: process.env.GRIDLINES_API_KEY,
        JWT_SECRET: process.env.JWT_SECRET,
    };
    // Optional but recommended variables
    const optionalVars = {
        ADMIN_NOTIFY_EMAILS: process.env.ADMIN_NOTIFY_EMAILS,
        CORS_ORIGINS: process.env.CORS_ORIGINS,
        NODE_ENV: process.env.NODE_ENV,
    };
    // Check critical variables
    Object.entries(criticalVars).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            errors.push(`Missing required environment variable: ${key}`);
        }
    });
    // Check JWT_SECRET length (should be at least 32 characters)
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        errors.push('JWT_SECRET must be at least 32 characters long for security');
    }
    // Check optional variables
    if (!optionalVars.ADMIN_NOTIFY_EMAILS) {
        warnings.push('ADMIN_NOTIFY_EMAILS not set - admin notifications will be disabled');
    }
    if (!optionalVars.NODE_ENV) {
        warnings.push('NODE_ENV not set - defaulting to development mode');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};
exports.validateEnvironment = validateEnvironment;
/**
 * Validates environment and throws error if critical variables are missing
 * Logs warnings for optional variables
 */
const validateEnvironmentOrThrow = () => {
    const result = (0, exports.validateEnvironment)();
    // Log warnings
    if (result.warnings.length > 0) {
        console.warn('⚠️  Environment Configuration Warnings:');
        result.warnings.forEach(warning => console.warn(`   - ${warning}`));
    }
    // Throw error if validation failed
    if (!result.isValid) {
        console.error('❌ Environment Configuration Errors:');
        result.errors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Environment validation failed. ${result.errors.length} critical variable(s) missing. ` +
            'Please check your .env file and ensure all required variables are set.');
    }
    console.log('✅ Environment configuration validated successfully');
};
exports.validateEnvironmentOrThrow = validateEnvironmentOrThrow;
exports.default = exports.validateEnvironmentOrThrow;
