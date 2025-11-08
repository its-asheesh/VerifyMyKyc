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
exports.BankAccountService = void 0;
const verify_provider_1 = require("./providers/verify.provider");
const verify_ifsc_provider_1 = require("./providers/verify-ifsc.provider");
const verify_upi_provider_1 = require("./providers/verify-upi.provider");
class BankAccountService {
    verify(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, verify_provider_1.verifyBankAccountProvider)(payload);
        });
    }
    validateIfsc(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, verify_ifsc_provider_1.verifyIfscProvider)(payload);
        });
    }
    verifyUpi(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, verify_upi_provider_1.verifyUpiProvider)(payload);
        });
    }
}
exports.BankAccountService = BankAccountService;
