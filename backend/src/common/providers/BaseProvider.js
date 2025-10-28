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
exports.BaseProvider = void 0;
exports.makeProviderApiCall = makeProviderApiCall;
exports.createStandardErrorMapper = createStandardErrorMapper;
const apiClient_1 = __importDefault(require("../http/apiClient"));
const error_1 = require("../http/error");
/**
 * Base provider class that handles common API patterns
 * Maintains all existing functionality while reducing duplication
 */
class BaseProvider {
    /**
     * Makes API call with consistent logging and error handling
     * Preserves exact same behavior as existing providers
     */
    makeApiCall(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { endpoint, payload, operationName, baseURL, logRequest, logResponse, customErrorMapper } = options;
            try {
                // Optional: Log request (default: true)
                if (logRequest !== false) {
                    console.log(`${operationName} API Request:`, {
                        url: endpoint,
                        payload,
                        baseURL: baseURL || process.env.GRIDLINES_BASE_URL
                    });
                }
                const response = yield apiClient_1.default.post(endpoint, payload);
                // Optional: Log response (default: true)
                if (logResponse !== false) {
                    console.log(`${operationName} API Response:`, {
                        status: response.status,
                        data: response.data
                    });
                }
                return response.data;
            }
            catch (error) {
                this.handleApiError(error, operationName, customErrorMapper);
            }
        });
    }
    /**
     * Maps errors to consistent format
     * Maintains exact same error mapping logic as existing providers
     */
    mapError(error, operationName, customMapper) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // Use custom mapper if provided
        if (customMapper) {
            return customMapper(error);
        }
        let errorMessage = `${operationName} failed`;
        let statusCode = 500;
        if (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.includes('timeout'))) {
            errorMessage = 'Request to Gridlines API timed out. Please try again.';
            statusCode = 408;
        }
        else if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            errorMessage = 'Invalid API key or authentication failed';
            statusCode = 401;
        }
        else if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
            errorMessage = `${operationName} endpoint not found`;
            statusCode = 404;
        }
        else if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
            statusCode = 429;
        }
        else if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 500) {
            // External API 500 - distinguish upstream errors when available
            if (((_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.error) === null || _g === void 0 ? void 0 : _g.code) === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
                errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
                statusCode = 503;
            }
            else {
                errorMessage = 'External API server error. Please try again.';
                statusCode = 502;
            }
        }
        else if ((_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.message) {
            errorMessage = error.response.data.message;
            statusCode = error.response.status || 500;
        }
        return { message: errorMessage, statusCode };
    }
    /**
     * Handles API errors with support for custom error mapper
     */
    handleApiError(error, operationName, customMapper) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Structured error logging for faster diagnostics (maintains existing pattern)
        console.error(`${operationName} API Error:`, {
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
        const { message, statusCode } = this.mapError(error, operationName, customMapper);
        throw new error_1.HTTPError(message, statusCode, (_g = error.response) === null || _g === void 0 ? void 0 : _g.data);
    }
    /**
     * Transforms payload to match external API format
     * Can be overridden by subclasses for specific transformations
     */
    transformPayload(payload) {
        return payload;
    }
    /**
     * Validates payload before making API call
     * Can be overridden by subclasses for specific validations
     */
    validatePayload(payload) {
        // Default validation - can be extended by subclasses
        if (!payload) {
            throw new Error('Payload is required');
        }
    }
    /**
     * Makes API call with payload transformation and validation
     * Convenience method that combines common operations
     */
    makeTransformedApiCall(endpoint, payload, operationName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validatePayload(payload);
            const transformedPayload = this.transformPayload(payload);
            return this.makeApiCall({
                endpoint,
                payload: transformedPayload,
                operationName
            });
        });
    }
}
exports.BaseProvider = BaseProvider;
/**
 * Functional version of makeApiCall - can be used without extending BaseProvider
 * Provides the same functionality with a simpler functional interface
 */
function makeProviderApiCall(options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const { endpoint, payload, operationName, logRequest, logResponse, customErrorMapper, headers, method = 'POST' } = options;
        try {
            // Optional: Log request (default: true)
            if (logRequest !== false) {
                console.log(`${operationName} Request:`, {
                    url: endpoint,
                    payload,
                    method,
                    headers: headers ? Object.keys(headers).reduce((acc, key) => {
                        acc[key] = key.includes('Key') || key.includes('Auth') ? '***' : headers[key];
                        return acc;
                    }, {}) : undefined,
                    baseURL: process.env.GRIDLINES_BASE_URL
                });
            }
            let response;
            if (method === 'GET') {
                response = yield apiClient_1.default.get(endpoint, headers ? { headers, params: payload } : { params: payload });
            }
            else {
                response = yield apiClient_1.default.post(endpoint, payload, headers ? { headers } : undefined);
            }
            // Optional: Log response (default: true)
            if (logResponse !== false) {
                console.log(`${operationName} Response:`, {
                    status: response.status,
                    data: response.data
                });
            }
            return response.data;
        }
        catch (error) {
            // Structured error logging
            console.error(`${operationName} Error:`, {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                config: {
                    url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                    method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                    baseURL: (_e = error.config) === null || _e === void 0 ? void 0 : _e.baseURL
                }
            });
            // Use custom error mapper if provided, otherwise use standard mapper
            const { message, statusCode } = customErrorMapper
                ? customErrorMapper(error)
                : createStandardErrorMapper(`${operationName} failed`)(error);
            throw new error_1.HTTPError(message, statusCode, (_f = error.response) === null || _f === void 0 ? void 0 : _f.data);
        }
    });
}
/**
 * Creates a standardized error mapper with custom default message
 * Returns an error mapping function with consistent behavior
 */
function createStandardErrorMapper(defaultMessage) {
    return (error) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let errorMessage = defaultMessage;
        let statusCode = 500;
        if (error.code === 'ECONNABORTED' || ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('timeout'))) {
            errorMessage = 'Request timed out. Please try again.';
            statusCode = 408;
        }
        else if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 401) {
            errorMessage = 'Invalid API key or authentication failed';
            statusCode = 401;
        }
        else if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 404) {
            errorMessage = 'API endpoint not found';
            statusCode = 404;
        }
        else if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
            statusCode = 429;
        }
        else if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 500) {
            if (((_h = (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.code) === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
                errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
                statusCode = 503;
            }
            else {
                errorMessage = 'External API server error. Please try again.';
                statusCode = 502;
            }
        }
        else if ((_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.message) {
            errorMessage = error.response.data.message;
            statusCode = error.response.status || 500;
        }
        return { message: errorMessage, statusCode };
    };
}
