"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_controller_1 = require("./passport.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
/**
 * Passport Verification APIs
 */
// Generate MRZ (Machine Readable Zone)
router.post('/mrz/generate', auth_1.authenticate, auth_1.requireUser, passport_controller_1.generateMrzHandler);
// Verify MRZ against passport details
router.post('/mrz/verify', auth_1.authenticate, auth_1.requireUser, passport_controller_1.verifyMrzHandler);
// Verify passport details against government database
router.post('/verify', auth_1.authenticate, auth_1.requireUser, passport_controller_1.verifyPassportHandler);
// Fetch passport details using file number and date of birth
router.post('/fetch', auth_1.authenticate, auth_1.requireUser, passport_controller_1.fetchPassportDetailsHandler);
// Extract data from passport using OCR
router.post('/ocr', auth_1.authenticate, auth_1.requireUser, passport_controller_1.extractPassportOcrDataHandler);
exports.default = router;
