"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gstin_controller_1 = require("./gstin.controller");
const router = (0, express_1.Router)();
// Fetch GSTIN by PAN
router.post('/fetch-by-pan', gstin_controller_1.fetchGstinByPanHandler);
// Fetch GSTIN Lite
router.post('/fetch-lite', gstin_controller_1.fetchGstinLiteHandler);
// Fetch GSTIN Contact Details
router.post('/fetch-contact', gstin_controller_1.fetchGstinContactHandler);
exports.default = router;
