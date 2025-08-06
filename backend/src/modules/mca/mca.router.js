"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mca_controller_1 = require("./mca.controller");
const router = (0, express_1.Router)();
// Fetch DIN by PAN
router.post('/din-by-pan', mca_controller_1.fetchDinByPanHandler);
// Fetch CIN by PAN
router.post('/cin-by-pan', mca_controller_1.fetchCinByPanHandler);
exports.default = router;
