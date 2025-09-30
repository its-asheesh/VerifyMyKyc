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
exports.EpfoService = void 0;
const providers_1 = require("./providers");
class EpfoService {
    fetchUan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.fetchUanProvider)(payload);
        });
    }
    generateOtp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.generateOtpProvider)(payload);
        });
    }
    validateOtp(transactionId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.validateOtpProvider)(transactionId, payload);
        });
    }
    listEmployers(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.listEmployersProvider)(transactionId);
        });
    }
    fetchPassbook(transactionId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.fetchPassbookProvider)(transactionId, payload);
        });
    }
    fetchEmploymentByUan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.employmentByUanProvider)(payload);
        });
    }
    fetchLatestEmployment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.employmentLatestProvider)(payload);
        });
    }
    fetchUanByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.uanByPanProvider)(payload);
        });
    }
    verifyEmployer(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, providers_1.employerVerifyProvider)(payload);
        });
    }
}
exports.EpfoService = EpfoService;
