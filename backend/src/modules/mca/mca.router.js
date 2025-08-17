"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mca_controller_1 = require("./mca.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
// Fetch DIN by PAN
router.post('/din-by-pan', auth_1.authenticate, auth_1.requireUser, mca_controller_1.fetchDinByPanHandler);
// Fetch CIN by PAN
router.post('/cin-by-pan', auth_1.authenticate, auth_1.requireUser, mca_controller_1.fetchCinByPanHandler);
// Fetch Company (by CIN/FCRN/LLPIN)
router.post('/fetch-company', auth_1.authenticate, auth_1.requireUser, mca_controller_1.fetchCompanyHandler);
exports.default = router;
