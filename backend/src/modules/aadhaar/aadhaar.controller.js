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
exports.fetchEAadhaarHandler = exports.aadhaarOcrV2Handler = exports.aadhaarOcrV1Handler = void 0;
const aadhaar_service_1 = require("./aadhaar.service");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const BaseController_1 = require("../../common/controllers/BaseController");
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
    }
}
// Create controller instance and export handlers
const controller = new AadhaarController();
exports.aadhaarOcrV1Handler = controller.aadhaarOcrV1Handler.bind(controller);
exports.aadhaarOcrV2Handler = controller.aadhaarOcrV2Handler.bind(controller);
exports.fetchEAadhaarHandler = controller.fetchEAadhaarHandler.bind(controller);
