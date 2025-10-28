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
exports.digilockerIssuedFilesProvider = digilockerIssuedFilesProvider;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../../../common/http/error");
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
const digilockerApiClient = axios_1.default.create({
    baseURL: process.env.GRIDLINES_BASE_URL,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY || '',
        'X-Auth-Type': 'API-Key',
    },
});
function digilockerIssuedFilesProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const headers = {
                'X-Transaction-ID': payload.transaction_id,
            };
            if (payload.reference_id) {
                headers['X-Reference-ID'] = payload.reference_id;
            }
            const response = yield digilockerApiClient.get('/digilocker/issued-files', {
                headers,
            });
            return response.data;
        }
        catch (error) {
            console.error('Digilocker Issued Files Error:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                config: {
                    url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                    method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                    baseURL: (_e = error.config) === null || _e === void 0 ? void 0 : _e.baseURL
                }
            });
            const { message, statusCode } = (0, BaseProvider_1.createStandardErrorMapper)('Digilocker Issued Files fetch failed')(error);
            throw new error_1.HTTPError(message, statusCode, (_f = error.response) === null || _f === void 0 ? void 0 : _f.data);
        }
    });
}
