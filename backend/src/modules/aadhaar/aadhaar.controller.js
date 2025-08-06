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
exports.fetchEAadhaarHandler = exports.aadhaarOcrV2Handler = exports.aadhaarOcrV1Handler = void 0;
const aadhaar_service_1 = require("./aadhaar.service");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const service = new aadhaar_service_1.AadhaarService();
// POST /api/aadhaar/ocr-v1
exports.aadhaarOcrV1Handler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { base64_data, consent } = req.body;
    const result = yield service.ocrV1(base64_data, consent);
    res.json(result);
}));
// POST /api/aadhaar/ocr-v2
exports.aadhaarOcrV2Handler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { consent } = req.body;
    const files = req.files;
    const file_front = (_a = files === null || files === void 0 ? void 0 : files.file_front) === null || _a === void 0 ? void 0 : _a[0];
    const file_back = (_b = files === null || files === void 0 ? void 0 : files.file_back) === null || _b === void 0 ? void 0 : _b[0];
    if (!file_front)
        throw new Error('file_front is required');
    const result = yield service.ocrV2(file_front.buffer, file_front.originalname, consent, file_back === null || file_back === void 0 ? void 0 : file_back.buffer, file_back === null || file_back === void 0 ? void 0 : file_back.originalname);
    res.json(result);
}));
exports.fetchEAadhaarHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transaction_id, json } = req.body;
    const result = yield service.fetchEAadhaar({ transaction_id, json });
    res.json(result);
}));
