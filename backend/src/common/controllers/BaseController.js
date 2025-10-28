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
exports.BaseController = void 0;
const quota_service_1 = require("../../modules/orders/quota.service");
/**
 * Base controller class that provides common patterns for verification modules
 * Maintains all existing functionality while reducing code duplication
 */
class BaseController {
    /**
     * Handles verification requests with quota management
     * Preserves exact same behavior as existing controllers
     */
    handleVerificationRequest(req, res, options, serviceMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            // Try primary verification type first, then fallbacks
            let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, options.verificationType);
            if (!order && options.fallbackTypes) {
                for (const fallbackType of options.fallbackTypes) {
                    order = yield (0, quota_service_1.ensureVerificationQuota)(userId, fallbackType);
                    if (order)
                        break;
                }
            }
            if (!order) {
                const fallbackMessage = options.fallbackTypes
                    ? `Verification quota exhausted or expired for ${options.verificationType} or ${options.fallbackTypes.join(', ')}`
                    : 'Verification quota exhausted or expired';
                res.status(403).json({ message: fallbackMessage });
                return;
            }
            // Validate required fields if specified
            if (options.requiredFields) {
                const missingFields = options.requiredFields.filter(field => !req.body[field]);
                if (missingFields.length > 0) {
                    res.status(400).json({
                        message: `${missingFields.join(', ')} are required`
                    });
                    return;
                }
            }
            // Validate consent if required
            if (options.requireConsent && !req.body.consent) {
                res.status(400).json({ message: 'consent is required' });
                return;
            }
            try {
                const result = yield serviceMethod();
                yield (0, quota_service_1.consumeVerificationQuota)(order);
                res.json(result);
            }
            catch (error) {
                throw error; // Let asyncHandler handle it
            }
        });
    }
    /**
     * Handles file upload verification requests
     * Maintains exact same file handling logic as existing controllers
     */
    handleFileUploadRequest(req, res, options, serviceMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const files = req.files;
            const file_front = (_a = files === null || files === void 0 ? void 0 : files.file_front) === null || _a === void 0 ? void 0 : _a[0];
            const file_back = (_b = files === null || files === void 0 ? void 0 : files.file_back) === null || _b === void 0 ? void 0 : _b[0];
            if (!file_front) {
                res.status(400).json({ message: 'file_front is required' });
                return;
            }
            return this.handleVerificationRequest(req, res, options, () => serviceMethod({ file_front, file_back }));
        });
    }
    /**
     * Handles simple verification requests without file uploads
     * For backward compatibility with existing patterns
     */
    handleSimpleVerificationRequest(req, res, verificationType, serviceMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleVerificationRequest(req, res, { verificationType }, serviceMethod);
        });
    }
    /**
     * Handles verification requests with fallback quota types
     * Used by modules like PAN that can consume from multiple quota types
     */
    handleVerificationWithFallback(req, res, primaryType, fallbackTypes, serviceMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleVerificationRequest(req, res, {
                verificationType: primaryType,
                fallbackTypes
            }, serviceMethod);
        });
    }
    /**
     * Validates request body fields
     * Maintains existing validation patterns
     */
    validateRequiredFields(req, fields) {
        const missingFields = fields.filter(field => !req.body[field]);
        return missingFields.length > 0 ? `${missingFields.join(', ')} are required` : null;
    }
    /**
     * Creates consistent response format
     * Maintains existing response structure
     */
    createSuccessResponse(data, message) {
        return Object.assign(Object.assign({ success: true }, (message && { message })), (data && { data }));
    }
    /**
     * Logs request details for debugging
     * Maintains existing logging patterns
     */
    logRequest(operationName, userId, additionalData) {
        console.log(`${operationName} Controller: incoming request`, Object.assign({ userId }, additionalData));
    }
    /**
     * Logs quota consumption details
     * Maintains existing quota logging patterns
     */
    logQuotaConsumption(order, operationName) {
        var _a;
        console.log(`${operationName} Controller: consumed 1 verification`, {
            orderId: order.orderId,
            newRemaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        });
    }
}
exports.BaseController = BaseController;
