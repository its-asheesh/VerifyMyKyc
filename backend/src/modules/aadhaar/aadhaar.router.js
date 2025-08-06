"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const aadhaar_controller_1 = require("./aadhaar.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
// Aadhaar OCR V1 (base64 image)
router.post('/ocr-v1', aadhaar_controller_1.aadhaarOcrV1Handler);
// Aadhaar OCR V2 (file upload)
router.post('/ocr-v2', upload.fields([
    { name: 'file_front', maxCount: 1 },
    { name: 'file_back', maxCount: 1 },
]), aadhaar_controller_1.aadhaarOcrV2Handler);
router.post('/fetch-eaadhaar', aadhaar_controller_1.fetchEAadhaarHandler);
exports.default = router;
