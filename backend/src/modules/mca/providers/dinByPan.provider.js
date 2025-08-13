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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDinByPanProvider = fetchDinByPanProvider;
var apiClient_1 = require("../../../common/http/apiClient");
var error_1 = require("../../../common/http/error");
function fetchDinByPanProvider(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var externalPayload, response, error_2, errorMessage, statusCode;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    _o.trys.push([0, 2, , 3]);
                    externalPayload = {
                        pan: payload.pan_number,
                        consent: payload.consent
                    };
                    console.log('DIN by PAN API Request:', {
                        url: '/mca-api/fetch-din-by-pan',
                        payload: externalPayload,
                        baseURL: process.env.GRIDLINES_BASE_URL
                    });
                    return [4 /*yield*/, apiClient_1.default.post('/mca-api/fetch-din-by-pan', externalPayload)];
                case 1:
                    response = _o.sent();
                    console.log('DIN by PAN API Response:', {
                        status: response.status,
                        data: response.data
                    });
                    return [2 /*return*/, response.data];
                case 2:
                    error_2 = _o.sent();
                    console.error('DIN by PAN API Error:', {
                        message: error_2.message,
                        status: (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.status,
                        data: (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data,
                        config: {
                            url: (_c = error_2.config) === null || _c === void 0 ? void 0 : _c.url,
                            method: (_d = error_2.config) === null || _d === void 0 ? void 0 : _d.method,
                            baseURL: (_e = error_2.config) === null || _e === void 0 ? void 0 : _e.baseURL,
                            headers: (_f = error_2.config) === null || _f === void 0 ? void 0 : _f.headers
                        }
                    });
                    errorMessage = 'Fetch DIN by PAN failed';
                    statusCode = 500;
                    if (error_2.code === 'ECONNABORTED' || error_2.message.includes('timeout')) {
                        errorMessage = 'Request to Gridlines API timed out. Please try again.';
                        statusCode = 408;
                    }
                    else if (((_g = error_2.response) === null || _g === void 0 ? void 0 : _g.status) === 401) {
                        errorMessage = 'Invalid API key or authentication failed';
                        statusCode = 401;
                    }
                    else if (((_h = error_2.response) === null || _h === void 0 ? void 0 : _h.status) === 404) {
                        errorMessage = 'DIN API endpoint not found';
                        statusCode = 404;
                    }
                    else if (((_j = error_2.response) === null || _j === void 0 ? void 0 : _j.status) === 429) {
                        errorMessage = 'Rate limit exceeded. Please try again later.';
                        statusCode = 429;
                    }
                    else if ((_l = (_k = error_2.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.message) {
                        errorMessage = error_2.response.data.message;
                        statusCode = error_2.response.status || 500;
                    }
                    throw new error_1.HTTPError(errorMessage, statusCode, (_m = error_2.response) === null || _m === void 0 ? void 0 : _m.data);
                case 3: return [2 /*return*/];
            }
        });
    });
}
