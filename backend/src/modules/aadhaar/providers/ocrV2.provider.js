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
const form_data_1 = __importDefault(require("form-data"));
function aadhaarOcrV2Provider(file_front, file_front_name, consent, file_back, file_back_name) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
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
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Aadhaar OCR V2 failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
