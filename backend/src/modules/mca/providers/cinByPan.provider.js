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
exports.fetchCinByPanProvider = fetchCinByPanProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
function fetchCinByPanProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        try {
            // Validate required inputs as per MCA docs: pan_number and consent are required
            if (!(payload === null || payload === void 0 ? void 0 : payload.pan_number)) {
                throw new error_1.HTTPError('pan_number is required', 400);
            }
            if (!(payload === null || payload === void 0 ? void 0 : payload.consent)) {
                throw new error_1.HTTPError('consent is required', 400);
            }
            const externalPayload = {
                pan_number: payload.pan_number,
                consent: payload.consent,
                // Some providers require human-readable consent text
                consent_text: payload.consent_text || 'User consented to fetch CIN by PAN for verification.',
            };
            // Mask PAN for logging (show only last 4)
            const maskedPan = (externalPayload === null || externalPayload === void 0 ? void 0 : externalPayload.pan_number) ? `******${externalPayload.pan_number.slice(-4)}` : undefined;
            console.log('CIN by PAN API Request:', {
                url: '/mca-api/cin-by-pan',
                pan_number: maskedPan,
                consent: externalPayload.consent,
                baseURL: process.env.GRIDLINES_BASE_URL
            });
            const response = yield apiClient_1.default.post('/mca-api/cin-by-pan', externalPayload);
            console.log('CIN by PAN API Response:', {
                status: response.status,
                data: response.data
            });
            return response.data;
        }
        catch (error) {
            console.error('CIN by PAN API Error:', {
                message: error.message,
                code: error.code,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                config: {
                    url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                    method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                    baseURL: (_e = error.config) === null || _e === void 0 ? void 0 : _e.baseURL
                }
            });
            // Provide clearer error mapping
            let errorMessage = 'Fetch CIN by PAN failed';
            let statusCode = 500;
            if (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.includes('timeout'))) {
                errorMessage = 'Request to Gridlines API timed out. Please try again.';
                statusCode = 408;
            }
            else if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) === 401) {
                errorMessage = 'Invalid API key or authentication failed';
                statusCode = 401;
            }
            else if (((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) === 400) {
                // Bubble up provider's reason when available
                const providerMsg = ((_k = (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.error) === null || _k === void 0 ? void 0 : _k.message) || ((_m = (_l = error.response) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.message);
                const providerType = (_q = (_p = (_o = error.response) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.error) === null || _q === void 0 ? void 0 : _q.type;
                if (providerMsg)
                    errorMessage = providerMsg;
                // If docs link includes a clearer snippet (e.g., "Consent not provided"), include it
                if (!providerMsg && typeof providerType === 'string') {
                    const note = providerType.split('Consent not provided').length > 1 ? 'Consent not provided.' : undefined;
                    if (note)
                        errorMessage = note;
                }
                statusCode = 400;
            }
            else if (((_r = error.response) === null || _r === void 0 ? void 0 : _r.status) === 404) {
                errorMessage = 'CIN API endpoint not found';
                statusCode = 404;
            }
            else if (((_s = error.response) === null || _s === void 0 ? void 0 : _s.status) === 429) {
                errorMessage = 'Rate limit exceeded. Please try again later.';
                statusCode = 429;
            }
            else if (((_t = error.response) === null || _t === void 0 ? void 0 : _t.status) === 500) {
                if (((_w = (_v = (_u = error.response) === null || _u === void 0 ? void 0 : _u.data) === null || _v === void 0 ? void 0 : _v.error) === null || _w === void 0 ? void 0 : _w.code) === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
                    errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
                    statusCode = 503;
                }
                else {
                    errorMessage = 'External API server error. Please try again.';
                    statusCode = 502;
                }
            }
            else if ((_y = (_x = error.response) === null || _x === void 0 ? void 0 : _x.data) === null || _y === void 0 ? void 0 : _y.message) {
                errorMessage = error.response.data.message;
                statusCode = error.response.status || 500;
            }
            throw new error_1.HTTPError(errorMessage, statusCode, (_z = error.response) === null || _z === void 0 ? void 0 : _z.data);
        }
    });
}
