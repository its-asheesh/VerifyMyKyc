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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitOtpV2Handler = exports.generateOtpV2Handler = exports.fetchEAadhaarHandler = exports.aadhaarOcrV2Handler = exports.aadhaarOcrV1Handler = void 0;
const aadhaar_service_1 = require("./aadhaar.service");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const BaseController_1 = require("../../common/controllers/BaseController");
const quota_service_1 = require("../orders/quota.service");
const service = new aadhaar_service_1.AadhaarService();
class AadhaarController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/aadhaar/ocr-v1
        this.aadhaarOcrV1Handler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { base64_data, consent } = req.body;
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'aadhaar',
                requireConsent: true,
                requiredFields: ['base64_data']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.ocrV1(base64_data, consent);
            }));
        }));
        // POST /api/aadhaar/ocr-v2
        this.aadhaarOcrV2Handler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleFileUploadRequest(req, res, {
                verificationType: 'aadhaar',
                requireConsent: true
            }, (files) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { consent } = req.body;
                return service.ocrV2(files.file_front.buffer, files.file_front.originalname, consent, (_a = files.file_back) === null || _a === void 0 ? void 0 : _a.buffer, (_b = files.file_back) === null || _b === void 0 ? void 0 : _b.originalname);
            }));
        }));
        // POST /api/aadhaar/e-aadhaar
        this.fetchEAadhaarHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { transaction_id, json } = req.body;
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'aadhaar',
                requiredFields: ['transaction_id']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchEAadhaar({ transaction_id, json });
            }));
        }));
        // POST /api/aadhaar/v2/generate-otp - QuickEKYC Aadhaar V2
        // NOTE: Does NOT consume quota - only checks quota exists
        this.generateOtpV2Handler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { id_number } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                // Validate user authentication
                if (!userId) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                // Validate required fields
                if (!id_number) {
                    res.status(400).json({ message: 'id_number is required' });
                    return;
                }
                // Validate consent
                if (!req.body.consent) {
                    res.status(400).json({ message: 'consent is required' });
                    return;
                }
                // Check quota exists (but don't consume yet)
                const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'aadhaar');
                if (!order) {
                    res.status(403).json({ message: 'Verification quota exhausted or expired' });
                    return;
                }
                // Log request
                this.logRequest('Aadhaar V2 Generate OTP', userId, {
                    aadhaar_number: id_number.replace(/.(?=.{4})/g, 'X')
                });
                // Generate OTP without consuming quota
                const result = yield service.generateOtpV2({ id_number });
                res.json(result);
            }
            catch (error) {
                // Log error for debugging
                console.error('Aadhaar V2 Generate OTP Handler Error:', {
                    message: error === null || error === void 0 ? void 0 : error.message,
                    stack: error === null || error === void 0 ? void 0 : error.stack,
                    status: error === null || error === void 0 ? void 0 : error.status,
                    response: (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data
                });
                // Re-throw to let asyncHandler handle it properly
                throw error;
            }
        }));
        // POST /api/aadhaar/v2/submit-otp - QuickEKYC Aadhaar V2
        // NOTE: Consumes quota ONLY after successful OTP verification
        this.submitOtpV2Handler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { request_id, otp, client_id } = req.body;
            const userId = req.user._id;
            // Validate required fields
            if (!request_id || !otp) {
                res.status(400).json({ message: 'request_id and otp are required' });
                return;
            }
            // Validate consent
            if (!req.body.consent) {
                res.status(400).json({ message: 'consent is required' });
                return;
            }
            // Check quota exists
            const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'aadhaar');
            if (!order) {
                res.status(403).json({ message: 'Verification quota exhausted or expired' });
                return;
            }
            // Log request
            this.logRequest('Aadhaar V2 Submit OTP', userId, { request_id });
            try {
                // Submit OTP and verify
                const result = yield service.submitOtpV2({ request_id, otp, client_id });
                // Only consume quota if verification was successful
                if (result.status === 'success' && ((_a = result.data) === null || _a === void 0 ? void 0 : _a.aadhaar_number)) {
                    yield (0, quota_service_1.consumeVerificationQuota)(order);
                    this.logQuotaConsumption(order, 'Aadhaar V2');
                }
                res.json(result);
            }
            catch (error) {
                // Don't consume quota if verification failed
                throw error; // Let asyncHandler handle it
            }
        }));
    }
}
// Create controller instance and export handlers
const controller = new AadhaarController();
exports.aadhaarOcrV1Handler = controller.aadhaarOcrV1Handler.bind(controller);
exports.aadhaarOcrV2Handler = controller.aadhaarOcrV2Handler.bind(controller);
exports.fetchEAadhaarHandler = controller.fetchEAadhaarHandler.bind(controller);
exports.generateOtpV2Handler = controller.generateOtpV2Handler.bind(controller);
exports.submitOtpV2Handler = controller.submitOtpV2Handler.bind(controller);
