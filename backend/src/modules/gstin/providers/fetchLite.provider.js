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
exports.fetchGstinLiteProvider = fetchGstinLiteProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
function fetchGstinLiteProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            if (payload.consent !== 'Y') {
                throw new error_1.HTTPError('Consent is required to fetch GSTIN details', 400);
            }
            const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
            if (!gstinRegex.test(payload.gstin)) {
                throw new error_1.HTTPError('Invalid GSTIN format', 400);
            }
            const requestBody = {
                gstin: payload.gstin,
                consent: payload.consent,
                include_hsn_data: payload.include_hsn_data || false,
                include_filing_data: payload.include_filing_data || false,
                include_filing_frequency: payload.include_filing_frequency || false
            };
            const response = yield apiClient_1.default.post('gstin-api/fetch-lite', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': process.env.GRIDLINES_API_KEY || '',
                    'X-Auth-Type': 'API-Key'
                }
            });
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch GSTIN Lite failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
