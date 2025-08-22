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
exports.fetchRcLiteDetailsProvider = fetchRcLiteDetailsProvider;
exports.fetchRcDetailedProvider = fetchRcDetailedProvider;
exports.fetchRcDetailedWithChallanProvider = fetchRcDetailedWithChallanProvider;
exports.fetchEChallanProvider = fetchEChallanProvider;
exports.fetchRegNumByChassisProvider = fetchRegNumByChassisProvider;
exports.fetchFastagDetailsProvider = fetchFastagDetailsProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
/**
 * Fetches basic RC (Registration Certificate) details.
 */
function fetchRcLiteDetailsProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield apiClient_1.default.post('/rc-api/fetch-lite', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch RC Lite Details failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
/**
 * Fetches detailed RC registration information.
 */
function fetchRcDetailedProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield apiClient_1.default.post('/rc-api/fetch-detailed', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch RC Detailed Details failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
/**
 * Fetches detailed RC information along with linked challans.
 */
function fetchRcDetailedWithChallanProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield apiClient_1.default.post('/rc-api/fetch-detailed-challan', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch RC Detailed With Challan failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
/**
 * Fetches e-challan details using RC, chassis, and engine number.
 */
function fetchEChallanProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield apiClient_1.default.post('/rc-api/echallan/fetch', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch E-Challan failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
/**
 * Fetches vehicle registration number using chassis number.
 */
function fetchRegNumByChassisProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield apiClient_1.default.post('/rc-api/fetch-reg-num-by-chassis', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch Registration Number by Chassis failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
/**
 * Fetches FASTag details using RC number or Tag ID.
 */
function fetchFastagDetailsProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const response = yield apiClient_1.default.post('/rc-api/fastag/fetch-detailed', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch FASTag Details failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
// Export all provider functions
exports.default = {
    fetchRcLiteDetailsProvider,
    fetchRcDetailedProvider,
    fetchRcDetailedWithChallanProvider,
    fetchEChallanProvider,
    fetchRegNumByChassisProvider,
    fetchFastagDetailsProvider,
};
