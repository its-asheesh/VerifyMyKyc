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
exports.generateMrzProvider = generateMrzProvider;
exports.verifyMrzProvider = verifyMrzProvider;
exports.verifyPassportProvider = verifyPassportProvider;
exports.fetchPassportDetailsProvider = fetchPassportDetailsProvider;
exports.extractPassportOcrDataProvider = extractPassportOcrDataProvider;
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
 * Generates MRZ (Machine Readable Zone) from passport details.
 */
function generateMrzProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return handleProviderRequest(apiClient_1.default.post('/passport-api/generate-mrz', payload), 'Failed to generate MRZ');
    });
}
/**
 * Verifies if the provided MRZ matches the given passport details.
 */
function verifyMrzProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return handleProviderRequest(apiClient_1.default.post('/passport-api/verify-mrz', payload), 'MRZ verification failed');
    });
}
/**
 * Verifies passport details (file number, DOB, name, etc.) against government database.
 */
function verifyPassportProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return handleProviderRequest(apiClient_1.default.post('/passport-api/verify', payload), 'Passport verification failed');
    });
}
/**
 * Fetches passport details using file number and date of birth.
 */
function fetchPassportDetailsProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return handleProviderRequest(apiClient_1.default.post('/passport-api/fetch', payload), 'Failed to fetch passport details');
    });
}
/**
 * Performs OCR on passport image/PDF to extract structured data.
 * Uses multipart/form-data for file upload.
 */
function extractPassportOcrDataProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        if (payload.file_front) {
            formData.append('file_front', payload.file_front);
        }
        if (payload.file_back) {
            formData.append('file_back', payload.file_back);
        }
        formData.append('consent', payload.consent);
        return handleProviderRequest(apiClient_1.default.post('/passport-api/ocr', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }), 'OCR extraction failed');
    });
}
