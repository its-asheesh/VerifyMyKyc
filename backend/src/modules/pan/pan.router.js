"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pan_controller_1 = require("./pan.controller");
const router = (0, express_1.Router)();
// Fetch Father's Name by PAN
router.post('/father-name', pan_controller_1.fetchFatherNameHandler);
// Check PAN-Aadhaar Link
router.post('/aadhaar-link', pan_controller_1.checkPanAadhaarLinkHandler);
// Digilocker Init
router.post('/digilocker-init', pan_controller_1.digilockerInitHandler);
// Digilocker Pull PAN
router.post('/digilocker-pull', pan_controller_1.digilockerPullHandler);
// Digilocker Fetch Document
router.post('/digilocker-fetch-document', pan_controller_1.digilockerFetchDocumentHandler);
exports.default = router;
