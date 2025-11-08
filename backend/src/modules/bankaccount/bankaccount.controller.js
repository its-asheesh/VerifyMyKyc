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
exports.verifyUpiHandler = exports.verifyIfscHandler = exports.verifyBankAccountHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const bankaccount_service_1 = require("./bankaccount.service");
const service = new bankaccount_service_1.BankAccountService();
// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
exports.verifyBankAccountHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { account_number, ifsc, consent } = (req.body || {});
    const maskedAcc = typeof account_number === 'string' ? account_number.replace(/.(?=.{4})/g, 'X') : undefined;
    console.info('[BankAccount] Incoming verify request', { account_number: maskedAcc, ifsc, consent });
    const result = yield service.verify(req.body);
    console.info('[BankAccount] Provider response', {
        status: result === null || result === void 0 ? void 0 : result.status,
        code: (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.code,
        message: (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.message,
    });
    res.json(result);
}));
// POST /api/bankaccount/verify-ifsc
// Body: { ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
exports.verifyIfscHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { ifsc, consent } = (req.body || {});
    console.info('[BankAccount] Incoming IFSC validate request', { ifsc, consent });
    const result = yield service.validateIfsc(req.body);
    console.info('[BankAccount] IFSC Provider response', {
        status: result === null || result === void 0 ? void 0 : result.status,
        code: (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.code,
        message: (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.message,
    });
    res.json(result);
}));
// POST /api/bankaccount/verify-upi
// Body: { upi: string, consent: 'Y' | 'N' } or { vpa: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
// Validation schema normalizes 'vpa' to 'upi' for compatibility
exports.verifyUpiHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { upi, consent } = req.body;
    // Mask UPI ID for logging (show only first 3 chars and last domain part)
    const maskedUpi = typeof upi === 'string'
        ? upi.split('@')[0].substring(0, 3) + '***@' + upi.split('@')[1]
        : undefined;
    console.info('[BankAccount] Incoming UPI verify request', { upi: maskedUpi, consent });
    const result = yield service.verifyUpi(req.body);
    console.info('[BankAccount] UPI Provider response', {
        status: result === null || result === void 0 ? void 0 : result.status,
        code: (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.code,
        message: (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.message,
    });
    res.json(result);
}));
