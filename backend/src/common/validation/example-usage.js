"use strict";
/**
 * Example Usage of Zod Validation Middleware
 *
 * This file shows how to use the validation middleware in your routes
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("./middleware");
const schemas_1 = require("./schemas");
const router = (0, express_1.Router)();
// Example 1: Register endpoint with validation
router.post('/register', (0, middleware_1.validate)(schemas_1.registerSchema), // This validates and sanitizes the request body
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // req.body is now validated and sanitized
    // You can safely use req.body.name, req.body.email, etc.
    // All inputs have been checked and transformed to proper types
    const { name, email, phone, password, company } = req.body;
    // TypeScript knows the types are correct
    console.log(`Registering user: ${name} (${email || phone})`);
    // ... rest of your handler logic
}));
// Example 2: Login endpoint with validation
router.post('/login', (0, middleware_1.validate)(schemas_1.loginSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // req.body.email and req.body.password are validated
    const { email, password, location } = req.body;
    // ... rest of your handler logic
}));
// Example 3: Change password with validation
router.put('/change-password', (0, middleware_1.validate)(schemas_1.changePasswordSchema), // Validates currentPassword and newPassword
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    // Both passwords are validated (min 6 characters)
    // ... rest of your handler logic
}));
// Example 4: Reset password with validation
router.post('/reset-password', (0, middleware_1.validate)(schemas_1.resetPasswordSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // email is validated as proper email format
    // otp is validated as exactly 6 characters
    // newPassword is validated as min 6 characters
    const { email, otp, newPassword } = req.body;
    // ... rest of your handler logic
}));
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
exports.default = router;
