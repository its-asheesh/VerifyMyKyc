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
exports.extractPassportOcrDataHandler = exports.fetchPassportDetailsHandler = exports.verifyPassportHandler = exports.verifyMrzHandler = exports.generateMrzHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const passport_service_1 = require("./passport.service");
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new passport_service_1.PassportService();
class PassportController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/passport/mrz/generate
        this.generateMrzHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, consent } = req.body || {};
            this.logRequest('Generate MRZ', req.user._id.toString(), {
                country_code,
                passport_number,
                surname
            });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'passport',
                requireConsent: true,
                requiredFields: ['country_code', 'passport_number', 'surname', 'given_name', 'gender', 'date_of_birth', 'date_of_expiry']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.generateMrz({
                    country_code,
                    passport_number,
                    surname,
                    given_name,
                    gender,
                    date_of_birth,
                    date_of_expiry,
                    consent,
                });
            }));
        }));
        // POST /api/passport/mrz/verify
        this.verifyMrzHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, mrz_first_line, mrz_second_line, consent } = req.body || {};
            this.logRequest('Verify MRZ', req.user._id.toString(), {
                country_code,
                passport_number,
                surname
            });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'passport',
                requireConsent: true,
                requiredFields: ['country_code', 'passport_number', 'surname', 'given_name', 'gender', 'date_of_birth', 'date_of_expiry', 'mrz_first_line', 'mrz_second_line']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.verifyMrz({
                    country_code,
                    passport_number,
                    surname,
                    given_name,
                    gender,
                    date_of_birth,
                    date_of_expiry,
                    mrz_first_line,
                    mrz_second_line,
                    consent,
                });
            }));
        }));
        // POST /api/passport/verify
        this.verifyPassportHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { file_number, passport_number, surname, given_name, date_of_birth, consent } = req.body || {};
            this.logRequest('Verify Passport', req.user._id.toString(), {
                file_number,
                passport_number,
                surname
            });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'passport',
                requireConsent: true,
                requiredFields: ['file_number', 'passport_number', 'surname', 'given_name', 'date_of_birth']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.verifyPassport({
                    file_number,
                    passport_number,
                    surname,
                    given_name,
                    date_of_birth,
                    consent,
                });
            }));
        }));
        // POST /api/passport/fetch
        this.fetchPassportDetailsHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { file_number, date_of_birth, consent } = req.body || {};
            this.logRequest('Fetch Passport Details', req.user._id.toString(), {
                file_number,
                date_of_birth
            });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'passport',
                requireConsent: true,
                requiredFields: ['file_number', 'date_of_birth']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchPassportDetails({
                    file_number,
                    date_of_birth,
                    consent,
                });
            }));
        }));
        // POST /api/passport/ocr - Special handler with blob conversion
        this.extractPassportOcrDataHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { consent } = req.body;
            // Handle multer files properly
            const files = req.files;
            let file_front = undefined;
            let file_back = undefined;
            // Handle both array and object formats of files
            if (Array.isArray(files)) {
                file_front = files[0];
            }
            else if (files && typeof files === 'object') {
                file_front = (_a = files['file_front']) === null || _a === void 0 ? void 0 : _a[0];
                file_back = (_b = files['file_back']) === null || _b === void 0 ? void 0 : _b[0];
            }
            if (!file_front || !consent) {
                return res.status(400).json({
                    message: 'file_front and consent are required'
                });
            }
            this.logRequest('Extract Passport OCR Data', req.user._id.toString(), {
                hasFileFront: !!file_front,
                hasFileBack: !!file_back,
                hasConsent: Boolean(consent),
            });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'passport'
            }, () => __awaiter(this, void 0, void 0, function* () {
                // Simplified buffer to blob conversion
                const convertToBlob = (file) => {
                    if (file.buffer instanceof Buffer) {
                        return new Blob([file.buffer], { type: file.mimetype });
                    }
                    else if (file.buffer instanceof ArrayBuffer) {
                        return new Blob([file.buffer], { type: file.mimetype });
                    }
                    else {
                        return new Blob([Buffer.from(file.buffer)], { type: file.mimetype });
                    }
                };
                return service.extractPassportOcrData({
                    file_front: convertToBlob(file_front),
                    file_back: file_back ? convertToBlob(file_back) : undefined,
                    consent,
                });
            }));
        }));
    }
}
// Create controller instance and export handlers
const controller = new PassportController();
exports.generateMrzHandler = controller.generateMrzHandler.bind(controller);
exports.verifyMrzHandler = controller.verifyMrzHandler.bind(controller);
exports.verifyPassportHandler = controller.verifyPassportHandler.bind(controller);
exports.fetchPassportDetailsHandler = controller.fetchPassportDetailsHandler.bind(controller);
exports.extractPassportOcrDataHandler = controller.extractPassportOcrDataHandler.bind(controller);
