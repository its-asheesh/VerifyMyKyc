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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
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
            // Handle API errors (200 OK with error status)
            if (response.data.status === 'error') {
                throw new error_1.HTTPError(response.data.message || 'QuickEKYC API Error', response.data.status_code || 502, response.data);
            }
            // Validate response structure
            if (!response.data || typeof response.data !== 'object') {
                throw new error_1.HTTPError('Invalid response from QuickEKYC API', 502);
            }
            return response.data;
        }
        catch (error) {
            // If it's already an HTTPError (e.g. from above), re-throw it
            if (error instanceof error_1.HTTPError) {
                throw error;
            }
            console.error('Aadhaar V2 Generate OTP Error:', {
                message: error.message,
                status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status,
                statusText: (_d = error.response) === null || _d === void 0 ? void 0 : _d.statusText,
                data: (_e = error.response) === null || _e === void 0 ? void 0 : _e.data,
                code: error.code,
                config: {
                    url: (_f = error.config) === null || _f === void 0 ? void 0 : _f.url,
                    method: (_g = error.config) === null || _g === void 0 ? void 0 : _g.method,
                }
            });
            // Handle network errors
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new error_1.HTTPError('Unable to connect to QuickEKYC API. Please check your network connection.', 503);
            }
            // Handle timeout
            if (error.code === 'ECONNABORTED' || ((_h = error.message) === null || _h === void 0 ? void 0 : _h.includes('timeout'))) {
                throw new error_1.HTTPError('Request to QuickEKYC API timed out. Please try again.', 408);
            }
            // Handle rate limit (429) specifically
            if (((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) === 429) {
                throw new error_1.HTTPError('Please wait 45 seconds before requesting another OTP for the same Aadhaar number', 429, (_k = error.response) === null || _k === void 0 ? void 0 : _k.data);
            }
            // Handle 401 Unauthorized (IP whitelisting)
            if (((_l = error.response) === null || _l === void 0 ? void 0 : _l.status) === 401) {
                const errorMessage = ((_o = (_m = error.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.message) || 'Unauthorized access to QuickEKYC API';
                throw new error_1.HTTPError(errorMessage.includes('whitelist')
                    ? 'IP address not whitelisted. Please contact support.'
                    : errorMessage, 502, (_p = error.response) === null || _p === void 0 ? void 0 : _p.data);
            }
            // Handle 500 from external API
            if (((_q = error.response) === null || _q === void 0 ? void 0 : _q.status) === 500) {
                throw new error_1.HTTPError('QuickEKYC API server error. Please try again later.', 502, (_r = error.response) === null || _r === void 0 ? void 0 : _r.data);
            }
            // Use standard error mapper for other errors
            const { message, statusCode } = (0, BaseProvider_1.createStandardErrorMapper)('Aadhaar V2 OTP generation failed')(error);
            throw new error_1.HTTPError(message, statusCode, (_s = error.response) === null || _s === void 0 ? void 0 : _s.data);
        }
    });
}
