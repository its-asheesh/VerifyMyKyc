"use strict";
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
exports.safeValidate = exports.validateParams = exports.validateQuery = exports.validate = void 0;
const zod_1 = require("zod");
const error_1 = require("../http/error");
/**
 * Validation middleware using Zod schemas
 * Provides consistent error handling for validation failures
 */
const validate = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Validate request body
            const validatedData = yield schema.parseAsync(req.body);
            // Replace request body with validated data (sanitized)
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Format Zod errors into user-friendly messages
                const errors = error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                const errorMessage = errors
                    .map((err) => `${err.path ? err.path + ': ' : ''}${err.message}`)
                    .join(', ');
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors,
                    error: errorMessage,
                });
            }
            // Handle other errors
            return res.status(500).json({
                success: false,
                message: 'Validation error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
};
exports.validate = validate;
/**
 * Validation middleware for query parameters
 */
const validateQuery = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validatedData = yield schema.parseAsync(req.query);
            req.query = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: 'Query validation failed',
                    errors,
                });
            }
            next(new error_1.HTTPError('Query validation error', 500));
        }
    });
};
exports.validateQuery = validateQuery;
/**
 * Validation middleware for URL parameters
 */
const validateParams = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validatedData = yield schema.parseAsync(req.params);
            req.params = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: 'Parameter validation failed',
                    errors,
                });
            }
            next(new error_1.HTTPError('Parameter validation error', 500));
        }
    });
};
exports.validateParams = validateParams;
/**
 * Safe error handler for async validators
 */
const safeValidate = (schema, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield schema.parseAsync(data);
        return { success: true, data: validatedData };
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return {
                success: false,
                errors: error.issues.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                })),
            };
        }
        return {
            success: false,
            errors: [{ message: 'Validation error' }],
        };
    }
});
exports.safeValidate = safeValidate;
