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
exports.aadhaarOcrV2Provider = aadhaarOcrV2Provider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
const form_data_1 = __importDefault(require("form-data"));
function aadhaarOcrV2Provider(file_front, file_front_name, consent, file_back, file_back_name) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const form = new form_data_1.default();
            form.append('file_front', file_front, file_front_name);
            if (file_back && file_back_name) {
                form.append('file_back', file_back, file_back_name);
            }
            form.append('consent', consent);
            const response = yield apiClient_1.default.post('/aadhaar-api/ocr/v2', form, {
                headers: form.getHeaders(),
                maxContentLength: 5 * 1024 * 1024, // 5MB
            });
            return response.data;
        }
        catch (error) {
            console.error('Aadhaar OCR V2 Error:', {
                message: error.message,
                status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                config: {
                    url: (_c = error.config) === null || _c === void 0 ? void 0 : _c.url,
                    method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
                    baseURL: (_e = error.config) === null || _e === void 0 ? void 0 : _e.baseURL
                }
            });
            const { message, statusCode } = (0, BaseProvider_1.createStandardErrorMapper)('Aadhaar OCR V2 failed')(error);
            throw new error_1.HTTPError(message, statusCode, (_f = error.response) === null || _f === void 0 ? void 0 : _f.data);
        }
    });
}
