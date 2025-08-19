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
exports.verifyBankAccountHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const bankaccount_service_1 = require("./bankaccount.service");
const service = new bankaccount_service_1.BankAccountService();
// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
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
