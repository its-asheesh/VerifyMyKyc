"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const voter_controller_1 = require("./voter.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
// Boson: Direct fetch
router.post('/boson/fetch', auth_1.authenticate, auth_1.requireUser, voter_controller_1.voterBosonFetchHandler);
// Meson: Init (captcha)
router.get('/meson/init', auth_1.authenticate, auth_1.requireUser, voter_controller_1.voterMesonInitHandler);
// Meson: Fetch with captcha
router.post('/meson/fetch', auth_1.authenticate, auth_1.requireUser, voter_controller_1.voterMesonFetchHandler);
// OCR: multipart/form-data
router.post('/ocr', auth_1.authenticate, auth_1.requireUser, upload.fields([{ name: 'file_front', maxCount: 1 }, { name: 'file_back', maxCount: 1 }]), voter_controller_1.voterOcrHandler);
exports.default = router;
