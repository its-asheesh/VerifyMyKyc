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
exports.fetchGstinContactProvider = fetchGstinContactProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
function fetchGstinContactProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        try {
            // Transform payload to match external API format
            const externalPayload = {
                gstin: payload.gstin,
                consent: payload.consent
            };
            const requestUrl = `${process.env.GRIDLINES_BASE_URL}/gstin-api/fetch-contact-details`;
            console.log('GSTIN Contact API Request:', {
                method: 'POST',
                url: requestUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.GRIDLINES_API_KEY ? '***' : 'MISSING',
                    'X-Auth-Type': 'API-Key'
                },
                data: externalPayload
            });
            const startTime = Date.now();
            let response;
            try {
                response = yield apiClient_1.default.post('/gstin-api/fetch-contact-details', externalPayload, {
                    timeout: 30000,
                    headers: {
                        'X-Reference-ID': `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
                    }
                });
                console.log(`GSTIN Contact API Response (${Date.now() - startTime}ms):`, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data
                });
                if (response.data && response.data.status === 200 && response.data.data) {
                    if (response.data.data.code === '1013') {
                        return {
                            email: ((_a = response.data.data.gstin_data) === null || _a === void 0 ? void 0 : _a.email) || '',
                            mobile: ((_b = response.data.data.gstin_data) === null || _b === void 0 ? void 0 : _b.mobile) || ''
                        };
                    }
                    else {
                        throw new error_1.HTTPError(response.data.data.message || 'Failed to fetch GSTIN contact details', response.status, { code: response.data.data.code });
                    }
                }
                else {
                    throw new error_1.HTTPError('Invalid response format from GSTIN contact details API', 500);
                }
            }
            catch (error) {
                console.error('GSTIN Contact API Error:', {
                    message: error.message,
                    status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status,
                    data: (_d = error.response) === null || _d === void 0 ? void 0 : _d.data,
                    config: {
                        url: (_e = error.config) === null || _e === void 0 ? void 0 : _e.url,
                        method: (_f = error.config) === null || _f === void 0 ? void 0 : _f.method,
                        baseURL: (_g = error.config) === null || _g === void 0 ? void 0 : _g.baseURL,
                        headers: (_h = error.config) === null || _h === void 0 ? void 0 : _h.headers
                    }
                });
                // Provide more specific error messages
                let errorMessage = 'Fetch GSTIN Contact Details failed';
                let statusCode = 500;
                if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                    errorMessage = 'Request to Gridlines API timed out. Please try again.';
                    statusCode = 408;
                }
                else if (((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) === 401) {
                    errorMessage = 'Invalid API key or authentication failed';
                    statusCode = 401;
                }
                else if (((_k = error.response) === null || _k === void 0 ? void 0 : _k.status) === 404) {
                    errorMessage = 'GSTIN contact details not found';
                    statusCode = 404;
                }
                else if (((_l = error.response) === null || _l === void 0 ? void 0 : _l.status) === 400) {
                    errorMessage = ((_m = error.response.data) === null || _m === void 0 ? void 0 : _m.message) || 'Invalid request parameters';
                    statusCode = 400;
                }
                else if ((_o = error.response) === null || _o === void 0 ? void 0 : _o.data) {
                    errorMessage = error.response.data.message || errorMessage;
                    statusCode = error.response.status || statusCode;
                }
                throw new error_1.HTTPError(errorMessage, statusCode, {
                    code: error.code,
                    response: (_p = error.response) === null || _p === void 0 ? void 0 : _p.data,
                    request: {
                        method: (_q = error.config) === null || _q === void 0 ? void 0 : _q.method,
                        url: (_r = error.config) === null || _r === void 0 ? void 0 : _r.url,
                        data: (_s = error.config) === null || _s === void 0 ? void 0 : _s.data
                    }
                });
            }
        }
        catch (error) {
            console.error('Unexpected error in fetchGstinContactProvider:', error);
            throw new error_1.HTTPError('An unexpected error occurred while processing your request', 500);
        }
    });
}
