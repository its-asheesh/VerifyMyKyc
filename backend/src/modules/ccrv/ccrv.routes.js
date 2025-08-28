"use strict";
// ccrv.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ccrv_controller_1 = require("./ccrv.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
/**
 * CCRV (Criminal Case Record Verification) APIs
 */
// Generate CCRV report
// POST /api/ccrv/generate-report
router.post('/generate-report', auth_1.authenticate, auth_1.requireUser, ccrv_controller_1.generateCCRVReportHandler);
// Fetch CCRV result
// POST /api/ccrv/fetch-result
router.post('/fetch-result', auth_1.authenticate, auth_1.requireUser, ccrv_controller_1.fetchCCRVResultHandler);
// Search CCRV records
// POST /api/ccrv/search
router.post('/search', auth_1.authenticate, auth_1.requireUser, ccrv_controller_1.searchCCRVHandler);
exports.default = router;
