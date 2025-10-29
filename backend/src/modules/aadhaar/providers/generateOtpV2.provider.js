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
exports.generateOtpV2Provider = generateOtpV2Provider;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../../common/http/error");
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
/**
 * Generate OTP for Aadhaar V2 verification using QuickEKYC API
 * Waits 45 seconds to generate OTP for same Aadhaar Number
 */
function generateOtpV2Provider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const apiKey = process.env.QUICKEKYC_API_KEY;
        const baseURL = process.env.QUICKEKYC_BASE_URL || 'https://api.quickekyc.com';
        if (!apiKey) {
            throw new error_1.HTTPError('QUICKEKYC_API_KEY is not configured', 500);
        }
        try {
            console.log('Aadhaar V2 Generate OTP Request:', {
                aadhaar_number: payload.id_number.replace(/.(?=.{4})/g, 'X'), // Mask Aadhaar
                url: `${baseURL}/api/v1/aadhaar-v2/generate-otp`,
            });
            const response = yield axios_1.default.post(`${baseURL}/api/v1/aadhaar-v2/generate-otp`, {
                key: apiKey,
                id_number: payload.id_number,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            console.log('Aadhaar V2 Generate OTP Response:', {
                status: response.status,
                otp_sent: (_a = response.data.data) === null || _a === void 0 ? void 0 : _a.otp_sent,
                valid_aadhaar: (_b = response.data.data) === null || _b === void 0 ? void 0 : _b.valid_aadhaar,
                request_id: response.data.request_id,
            });
            return response.data;
        }
        catch (error) {
            console.error('Aadhaar V2 Generate OTP Error:', {
                message: error.message,
                status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status,
                data: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data,
            });
            // Handle rate limit (429) specifically
            if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 429) {
                throw new error_1.HTTPError('Please wait 45 seconds before requesting another OTP for the same Aadhaar number', 429, (_f = error.response) === null || _f === void 0 ? void 0 : _f.data);
            }
            const { message, statusCode } = (0, BaseProvider_1.createStandardErrorMapper)('Aadhaar V2 OTP generation failed')(error);
            throw new error_1.HTTPError(message, statusCode, (_g = error.response) === null || _g === void 0 ? void 0 : _g.data);
        }
    });
}
