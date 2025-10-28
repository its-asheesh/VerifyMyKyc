"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = exports.fileUploadLimiter = exports.verificationLimiter = exports.apiLimiter = exports.registerLimiter = exports.passwordResetLimiter = exports.otpLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Rate limiter configurations for different endpoints
 */
// Authentication endpoints - Stricter limits
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later',
        retryAfter: 15
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for certain IPs in development
        if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
            return true;
        }
        return false;
    }
});
// OTP endpoints - Very strict limits
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: {
        success: false,
        message: 'Too many OTP requests, please try again after 15 minutes',
        retryAfter: 15
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Password reset - Very strict limits
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset attempts per hour
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again after 1 hour',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Registration - Moderate limits
exports.registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 registrations per hour
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false
});
// General API - Moderate limits
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: 15
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for certain IPs in development
        if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
            return true;
        }
        return false;
    }
});
// Verification endpoints - Moderate limits (these cost quota)
exports.verificationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each IP to 20 verification requests per minute
    message: {
        success: false,
        message: 'Too many verification requests, please slow down',
        retryAfter: 1
    },
    standardHeaders: true,
    legacyHeaders: false
});
// File upload endpoints - Strict limits (large payloads)
exports.fileUploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 file uploads per minute
    message: {
        success: false,
        message: 'Too many file uploads, please try again later',
        retryAfter: 1
    },
    standardHeaders: true,
    legacyHeaders: false
});
/**
 * Create custom rate limiter with specific configuration
 */
const createRateLimiter = (options) => {
    return (0, express_rate_limit_1.default)({
        windowMs: options.windowMs,
        max: options.max,
        message: options.message || 'Too many requests, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
        skip: options.skip
    });
};
exports.createRateLimiter = createRateLimiter;
