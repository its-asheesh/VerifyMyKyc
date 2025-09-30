"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const epfo_controller_1 = require("./epfo.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
// Fetch UAN(s) by mobile and optional PAN
router.post('/fetch-uan', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.fetchUanHandler);
// Passbook V1 flow
router.post('/passbook/generate-otp', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.generateOtpHandler);
router.post('/passbook/validate-otp', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.validateOtpHandler);
router.get('/passbook/employers', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.listEmployersHandler);
router.post('/passbook/fetch', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.fetchPassbookHandler);
// Employment history
router.post('/employment-history/fetch-by-uan', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.employmentByUanHandler);
router.post('/employment-history/fetch-latest', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.employmentLatestHandler);
// UAN by PAN
router.post('/uan/fetch-by-pan', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.uanByPanHandler);
// Employer verify
router.post('/employer-verify', auth_1.authenticate, auth_1.requireUser, epfo_controller_1.employerVerifyHandler);
exports.default = router;
