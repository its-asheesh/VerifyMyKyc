"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const drivinglicense_controller_1 = require("./drivinglicense.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
// Driving License OCR (multipart/form-data)
router.post('/ocr', upload.fields([{ name: 'file_front', maxCount: 1 }, { name: 'file_back', maxCount: 1 }]), drivinglicense_controller_1.drivingLicenseOcrHandler);
// Fetch Driving License Details (JSON)
router.post('/fetch-details', drivinglicense_controller_1.fetchDrivingLicenseDetailsHandler);
exports.default = router;
