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
exports.fetchGstinByPanProvider = fetchGstinByPanProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
function fetchGstinByPanProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        try {
            // Transform payload to match external API format
            const externalPayload = {
                pan_number: payload.pan_number,
                consent: payload.consent
            };
            console.log('GSTIN by PAN API Request:', {
                url: '/gstin-api/fetch-by-pan',
                payload: externalPayload,
                baseURL: process.env.GRIDLINES_BASE_URL
            });
            const response = yield apiClient_1.default.post('/gstin-api/fetch-by-pan', externalPayload);
            console.log('GSTIN by PAN API Response:', {
                status: response.status,
                data: response.data
            });
            return response.data;
        }
        catch (error) {
            console.error('GSTIN by PAN API Error:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                config: {
                    url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                    method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                    baseURL: (_e = error.config) === null || _e === void 0 ? void 0 : _e.baseURL,
                    headers: (_f = error.config) === null || _f === void 0 ? void 0 : _f.headers
                }
            });
            // Provide more specific error messages
            let errorMessage = 'Fetch GSTIN by PAN failed';
            let statusCode = 500;
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                errorMessage = 'Request to Gridlines API timed out. Please try again.';
                statusCode = 408;
            }
            else if (((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) === 401) {
                errorMessage = 'Invalid API key or authentication failed';
                statusCode = 401;
            }
            else if (((_h = error.response) === null || _h === void 0 ? void 0 : _h.status) === 404) {
                errorMessage = 'GSTIN API endpoint not found';
                statusCode = 404;
            }
            else if (((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) === 429) {
                errorMessage = 'Rate limit exceeded. Please try again later.';
                statusCode = 429;
            }
            else if (((_k = error.response) === null || _k === void 0 ? void 0 : _k.status) === 500) {
                // Handle external API 500 errors (government source issues)
                if (((_o = (_m = (_l = error.response) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.error) === null || _o === void 0 ? void 0 : _o.code) === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
                    errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
                    statusCode = 503;
                }
                else {
                    errorMessage = 'External API server error. Please try again.';
                    statusCode = 502;
                }
            }
            else if ((_q = (_p = error.response) === null || _p === void 0 ? void 0 : _p.data) === null || _q === void 0 ? void 0 : _q.message) {
                errorMessage = error.response.data.message;
                statusCode = error.response.status || 500;
            }
            throw new error_1.HTTPError(errorMessage, statusCode, (_r = error.response) === null || _r === void 0 ? void 0 : _r.data);
        }
    });
}
