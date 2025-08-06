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
exports.digilockerPullPanProvider = digilockerPullPanProvider;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../../common/http/error");
function digilockerPullPanProvider(payload, transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        try {
            // Custom API client for Digilocker endpoints with transaction ID
            const digilockerApiClient = axios_1.default.create({
                baseURL: process.env.GRIDLINES_BASE_URL,
                timeout: 10000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.GRIDLINES_API_KEY || '',
                    'X-Auth-Type': 'API-Key',
                    'X-Transaction-ID': transactionId, // Use the provided transaction ID
                },
            });
            console.log('Digilocker Pull PAN API Request:', {
                url: '/digilocker/pan/pull-document',
                payload,
                transactionId,
                baseURL: process.env.GRIDLINES_BASE_URL
            });
            const response = yield digilockerApiClient.post('/digilocker/pan/pull-document', payload);
            console.log('Digilocker Pull PAN API Response:', {
                status: response.status,
                data: response.data
            });
            return response.data;
        }
        catch (error) {
            console.error('Digilocker Pull PAN API Error:', {
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
            // Handle specific DigiLocker authorization error
            if (((_j = (_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error) === null || _j === void 0 ? void 0 : _j.code) === 'DIGILOCKER_AUTHORIZATION_NOT_COMPLETED') {
                throw new error_1.HTTPError('DigiLocker authorization not completed. Please complete the OAuth flow first by visiting the authorization URL from the init API.', 400, {
                    error: {
                        code: 'DIGILOCKER_AUTHORIZATION_NOT_COMPLETED',
                        message: 'Please complete the DigiLocker authorization by visiting the authorization URL from the init API.',
                        details: (_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.error
                    }
                });
            }
            throw new error_1.HTTPError(((_o = (_m = error.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.message) || 'Digilocker Pull PAN failed', ((_p = error.response) === null || _p === void 0 ? void 0 : _p.status) || 500, (_q = error.response) === null || _q === void 0 ? void 0 : _q.data);
        }
    });
}
