"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pan_controller_1 = require("./pan.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
// Fetch Father's Name by PAN
router.post('/father-name', auth_1.authenticate, auth_1.requireUser, pan_controller_1.fetchFatherNameHandler);
// GSTIN by PAN
router.post('/gstin-by-pan', auth_1.authenticate, auth_1.requireUser, pan_controller_1.fetchGstinByPanHandler);
// DIN by PAN (MCA)
router.post('/din-by-pan', auth_1.authenticate, auth_1.requireUser, pan_controller_1.fetchDinByPanHandler);
// CIN by PAN (MCA)
router.post('/cin-by-pan', auth_1.authenticate, auth_1.requireUser, pan_controller_1.fetchCinByPanHandler);
// Check PAN-Aadhaar Link
router.post('/aadhaar-link', auth_1.authenticate, auth_1.requireUser, pan_controller_1.checkPanAadhaarLinkHandler);
// Digilocker Init
router.post('/digilocker-init', auth_1.authenticate, auth_1.requireUser, pan_controller_1.digilockerInitHandler);
// Digilocker Pull PAN
router.post('/digilocker-pull', auth_1.authenticate, auth_1.requireUser, pan_controller_1.digilockerPullHandler);
// Digilocker Fetch Document
router.post('/digilocker-fetch-document', auth_1.authenticate, auth_1.requireUser, pan_controller_1.digilockerFetchDocumentHandler);
exports.default = router;
