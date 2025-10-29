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
exports.AadhaarService = void 0;
const ocrV1_provider_1 = require("./providers/ocrV1.provider");
const ocrV2_provider_1 = require("./providers/ocrV2.provider");
const fetchEAadhaar_provider_1 = require("./providers/fetchEAadhaar.provider");
const generateOtpV2_provider_1 = require("./providers/generateOtpV2.provider");
const submitOtpV2_provider_1 = require("./providers/submitOtpV2.provider");
class AadhaarService {
    // For base64 image OCR (V1) - Legacy
    ocrV1(base64_data, consent) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ocrV1_provider_1.aadhaarOcrV1Provider)(base64_data, consent);
        });
    }
    // For file upload OCR (V2) - Legacy
    ocrV2(file_front, file_front_name, consent, file_back, file_back_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ocrV2_provider_1.aadhaarOcrV2Provider)(file_front, file_front_name, consent, file_back, file_back_name);
        });
    }
    // Legacy e-Aadhaar fetch
    fetchEAadhaar(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchEAadhaar_provider_1.fetchEAadhaarProvider)(payload);
        });
    }
    // QuickEKYC Aadhaar V2 - Generate OTP
    generateOtpV2(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, generateOtpV2_provider_1.generateOtpV2Provider)(payload);
        });
    }
    // QuickEKYC Aadhaar V2 - Submit OTP
    submitOtpV2(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, submitOtpV2_provider_1.submitOtpV2Provider)(payload);
        });
    }
}
exports.AadhaarService = AadhaarService;
