import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiter configurations for different endpoints
 */

// Authentication endpoints - Stricter limits
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for certain IPs in development
    if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
      return true;
    }
    return false;
  }
});

// OTP endpoints - Very strict limits
export const otpLimiter = rateLimit({
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
export const passwordResetLimiter = rateLimit({
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
export const registerLimiter = rateLimit({
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
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Skip rate limiting for certain IPs in development
    if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
      return true;
    }
    return false;
  }
});

// Verification endpoints - Moderate limits (these cost quota)
export const verificationLimiter = rateLimit({
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
export const fileUploadLimiter = rateLimit({
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
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skip?: (req: Request) => boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skip: options.skip
  });
};

