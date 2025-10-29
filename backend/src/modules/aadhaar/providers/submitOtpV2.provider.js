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
exports.submitOtpV2Provider = submitOtpV2Provider;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../../common/http/error");
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
/**
 * Submit OTP for Aadhaar V2 verification using QuickEKYC API
 */
function submitOtpV2Provider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const apiKey = process.env.QUICKEKYC_API_KEY;
        const baseURL = process.env.QUICKEKYC_BASE_URL || 'https://api.quickekyc.com';
        if (!apiKey) {
            throw new error_1.HTTPError('QUICKEKYC_API_KEY is not configured', 500);
        }
        try {
            console.log('Aadhaar V2 Submit OTP Request:', {
                request_id: payload.request_id,
                has_otp: !!payload.otp,
                url: `${baseURL}/api/v1/aadhaar-v2/submit-otp`,
            });
            const response = yield axios_1.default.post(`${baseURL}/api/v1/aadhaar-v2/submit-otp`, Object.assign({ key: apiKey, request_id: payload.request_id, otp: payload.otp }, (payload.client_id && { client_id: payload.client_id })), {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            console.log('Aadhaar V2 Submit OTP Response:', {
                status: response.status,
                success: response.data.status === 'success',
                has_data: !!response.data.data,
                request_id: response.data.request_id,
            });
            return response.data;
        }
        catch (error) {
            console.error('Aadhaar V2 Submit OTP Error:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
            });
            // Handle invalid OTP/request_id
            if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 200 && ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.status) === 'error') {
                throw new error_1.HTTPError(error.response.data.message || 'Invalid OTP or request ID', 400, error.response.data);
            }
            const { message, statusCode } = (0, BaseProvider_1.createStandardErrorMapper)('Aadhaar V2 OTP submission failed')(error);
            throw new error_1.HTTPError(message, statusCode, (_f = error.response) === null || _f === void 0 ? void 0 : _f.data);
        }
    });
}
