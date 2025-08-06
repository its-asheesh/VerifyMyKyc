"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const echallan_controller_1 = require("./echallan.controller");
const router = (0, express_1.Router)();
router.post('/fetch', echallan_controller_1.fetchEChallanHandler);
exports.default = router;
