"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const aadhaar_controller_1 = require("./aadhaar.controller");
const auth_1 = require("../../common/middleware/auth");
const middleware_1 = require("../../common/validation/middleware");
const rateLimiter_1 = require("../../common/middleware/rateLimiter");
const schemas_1 = require("../../common/validation/schemas");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
// Legacy Aadhaar OCR endpoints (kept for backward compatibility)
router.post('/ocr-v1', auth_1.authenticate, auth_1.requireUser, aadhaar_controller_1.aadhaarOcrV1Handler);
router.post('/ocr-v2', auth_1.authenticate, auth_1.requireUser, upload.fields([
    { name: 'file_front', maxCount: 1 },
    { name: 'file_back', maxCount: 1 },
]), aadhaar_controller_1.aadhaarOcrV2Handler);
router.post('/fetch-eaadhaar', auth_1.authenticate, auth_1.requireUser, aadhaar_controller_1.fetchEAadhaarHandler);
// QuickEKYC Aadhaar V2 Endpoints (New Implementation)
router.post('/v2/generate-otp', auth_1.authenticate, auth_1.requireUser, rateLimiter_1.otpLimiter, (0, middleware_1.validate)(schemas_1.aadhaarGenerateOtpV2Schema), aadhaar_controller_1.generateOtpV2Handler);
router.post('/v2/submit-otp', auth_1.authenticate, auth_1.requireUser, rateLimiter_1.apiLimiter, (0, middleware_1.validate)(schemas_1.aadhaarSubmitOtpV2Schema), aadhaar_controller_1.submitOtpV2Handler);
exports.default = router;
