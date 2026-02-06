/**
 * Example Usage of Zod Validation Middleware
 *
 * This file shows how to use the validation middleware in your routes
 */

import { Router } from 'express';
import { validate } from './middleware';
import { registerSchema, loginSchema, changePasswordSchema, resetPasswordSchema } from './schemas';

const router = Router();

// Example 1: Register endpoint with validation
router.post(
  '/register',
  validate(registerSchema), // This validates and sanitizes the request body
  async (req, res) => {
    // req.body is now validated and sanitized
    // You can safely use req.body.name, req.body.email, etc.
    // All inputs have been checked and transformed to proper types

    const { name, email, phone, password, company } = req.body;

    // TypeScript knows the types are correct
    console.log(`Registering user: ${name} (${email || phone})`);

    // ... rest of your handler logic
  },
);

// Example 2: Login endpoint with validation
router.post('/login', validate(loginSchema), async (req, res) => {
  // req.body.email and req.body.password are validated
  const { email, password, location } = req.body;

  // ... rest of your handler logic
});

// Example 3: Change password with validation
router.put(
  '/change-password',
  validate(changePasswordSchema), // Validates currentPassword and newPassword
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Both passwords are validated (min 6 characters)
    // ... rest of your handler logic
  },
);

// Example 4: Reset password with validation
router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  // email is validated as proper email format
  // otp is validated as exactly 6 characters
  // newPassword is validated as min 6 characters
  const { email, otp, newPassword } = req.body;

  // ... rest of your handler logic
});

/**
 * Benefits of using Zod validation:
 *
 * 1. ✅ Type Safety
 *    - TypeScript automatically infers types from schemas
 *    - No need to manually type req.body
 *
 * 2. ✅ Input Sanitization
 *    - Strings are automatically trimmed
 *    - Emails are normalized
 *    - PAN numbers are uppercase
 *
 * 3. ✅ Consistent Error Messages
 *    - All validation errors return in the same format
 *    - Frontend can handle errors consistently
 *
 * 4. ✅ Security
 *    - Prevents injection attacks
 *    - Validates data types
 *    - Checks required fields
 *
 * 5. ✅ Less Code
 *    - No manual validation needed
 *    - No repeated error handling
 *    - Schema is reusable
 */

/**
 * Example Validation Response:
 *
 * Success: Passes to next() middleware
 *
 * Failure: Returns 400 with error details:
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": [
 *     {
 *       "path": "email",
 *       "message": "Invalid email address"
 *     },
 *     {
 *       "path": "password",
 *       "message": "String must contain at least 6 character(s)"
 *     }
 *   ],
 *   "error": "email: Invalid email address, password: String must contain at least 6 character(s)"
 * }
 */

export default router;
