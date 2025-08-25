"use strict";
// passport.controller.ts
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
const quota_service_1 = require("../orders/quota.service");
const service = new passport_service_1.PassportService();
// POST /api/passport/mrz/generate
exports.generateMrzHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, consent } = req.body || {};
    if (!country_code || !passport_number || !surname || !given_name || !gender || !date_of_birth || !date_of_expiry || !consent) {
        return res.status(400).json({
            message: 'All fields (country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, consent) are required'
        });
    }
    console.log('Generate MRZ Controller: incoming request', {
        userId,
        country_code,
        passport_number,
        surname,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'passport');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.generateMrz({
        country_code,
        passport_number,
        surname,
        given_name,
        gender,
        date_of_birth,
        date_of_expiry,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    console.log('Generate MRZ Controller: consumed 1 verification', {
        orderId: order.orderId,
        newRemaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
    });
    res.json(result);
}));
// POST /api/passport/mrz/verify
exports.verifyMrzHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, mrz_first_line, mrz_second_line, consent } = req.body || {};
    if (!country_code || !passport_number || !surname || !given_name || !gender || !date_of_birth || !date_of_expiry || !mrz_first_line || !mrz_second_line || !consent) {
        return res.status(400).json({
            message: 'All fields (country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, mrz_first_line, mrz_second_line, consent) are required'
        });
    }
    console.log('Verify MRZ Controller: incoming request', {
        userId,
        country_code,
        passport_number,
        surname,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'passport');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.verifyMrz({
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
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/passport/verify
exports.verifyPassportHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { file_number, passport_number, surname, given_name, date_of_birth, consent } = req.body || {};
    if (!file_number || !passport_number || !surname || !given_name || !date_of_birth || !consent) {
        return res.status(400).json({
            message: 'All fields (file_number, passport_number, surname, given_name, date_of_birth, consent) are required'
        });
    }
    console.log('Verify Passport Controller: incoming request', {
        userId,
        file_number,
        passport_number,
        surname,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'passport');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.verifyPassport({
        file_number,
        passport_number,
        surname,
        given_name,
        date_of_birth,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/passport/fetch
exports.fetchPassportDetailsHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { file_number, date_of_birth, consent } = req.body || {};
    if (!file_number || !date_of_birth || !consent) {
        return res.status(400).json({
            message: 'file_number, date_of_birth, and consent are required'
        });
    }
    console.log('Fetch Passport Details Controller: incoming request', {
        userId,
        file_number,
        date_of_birth,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'passport');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchPassportDetails({
        file_number,
        date_of_birth,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/passport/ocr
exports.extractPassportOcrDataHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.user._id;
    const { consent } = req.body;
    // Handle multer files properly
    const files = req.files; // Use 'any' to avoid type issues
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
    console.log('Extract Passport OCR Data Controller: incoming request', {
        userId,
        hasFileFront: !!file_front,
        hasFileBack: !!file_back,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'passport');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    // Simplified buffer to blob conversion
    const convertToBlob = (file) => {
        // For multer files, we can directly use the buffer
        if (file.buffer instanceof Buffer) {
            return new Blob([file.buffer], { type: file.mimetype });
        }
        else if (file.buffer instanceof ArrayBuffer) {
            return new Blob([file.buffer], { type: file.mimetype });
        }
        else {
            // Fallback
            return new Blob([Buffer.from(file.buffer)], { type: file.mimetype });
        }
    };
    const result = yield service.extractPassportOcrData({
        file_front: convertToBlob(file_front),
        file_back: file_back ? convertToBlob(file_back) : undefined,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
