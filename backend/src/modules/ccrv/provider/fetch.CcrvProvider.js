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
exports.generateCCRVReportProvider = generateCCRVReportProvider;
exports.fetchCCRVResultProvider = fetchCCRVResultProvider;
exports.searchCCRVProvider = searchCCRVProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
/**
 * A generic helper to wrap API calls, handle responses, and standardize error handling.
 * @param requestPromise A promise returned by an apiClient call.
 * @param defaultErrorMessage A fallback error message.
 * @returns The data from the API response.
 */
function handleProviderRequest(requestPromise, defaultErrorMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield requestPromise;
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || defaultErrorMessage, ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
/**
 * Generates a CCRV report for criminal case record verification.
 * This API initiates the CCRV verification process and returns a transaction ID.
 */
function generateCCRVReportProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return handleProviderRequest(apiClient_1.default.post('/ccrv-api/rapid/generate-report', payload), 'Failed to generate CCRV report');
    });
}
/**
 * Fetches the CCRV result using the transaction ID.
 * This API is used to get the status of verification or the final result.
 */
function fetchCCRVResultProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return handleProviderRequest(apiClient_1.default.get('/ccrv-api/rapid/result', {
            headers: {
                'X-Transaction-ID': payload.transaction_id
            }
        }), 'Failed to fetch CCRV result');
    });
}
/**
 * Searches for CCRV records based on name and address.
 * This API initiates a search for criminal case records.
 */
function searchCCRVProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CCRV Search Provider: sending payload to API:', JSON.stringify(payload, null, 2));
        console.log('CCRV Search Provider: API URL:', process.env.GRIDLINES_BASE_URL + '/ccrv-api/rapid/search');
        console.log('CCRV Search Provider: API Key set:', !!process.env.GRIDLINES_API_KEY);
        console.log('CCRV Search Provider: API Key value:', process.env.GRIDLINES_API_KEY ? 'SET' : 'NOT SET');
        // Ensure consent is properly formatted
        const formattedPayload = Object.assign(Object.assign({}, payload), { consent: payload.consent === 'Y' ? 'Y' : 'N' });
        console.log('CCRV Search Provider: formatted payload:', JSON.stringify(formattedPayload, null, 2));
        // Use the correct endpoint from API documentation
        const endpoint = '/ccrv-api/rapid/search';
        console.log(`CCRV Search Provider: using endpoint ${endpoint}`);
        return handleProviderRequest(apiClient_1.default.post(endpoint, formattedPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Key': process.env.GRIDLINES_API_KEY,
                'X-Auth-Type': 'API-Key',
                'X-Reference-ID': `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
            }
        }), 'CCRV search failed');
    });
}
// Export all CCRV provider functions
exports.default = {
    generateCCRVReportProvider,
    fetchCCRVResultProvider,
    searchCCRVProvider,
};
