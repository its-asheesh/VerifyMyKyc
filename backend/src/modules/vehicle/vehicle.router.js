"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
/**
 * RC Verification APIs
 */
// Fetch basic RC details
router.post('/rc/fetch-lite', auth_1.authenticate, auth_1.requireUser, vehicle_controller_1.fetchRcLiteHandler);
// Fetch detailed RC information
router.post('/rc/fetch-detailed', auth_1.authenticate, auth_1.requireUser, vehicle_controller_1.fetchRcDetailedHandler);
// Fetch RC details with linked challans
router.post('/rc/fetch-detailed-challan', auth_1.authenticate, auth_1.requireUser, vehicle_controller_1.fetchRcDetailedWithChallanHandler);
// Fetch e-challan details by RC, chassis, and engine number
router.post('/challan/fetch', auth_1.authenticate, auth_1.requireUser, vehicle_controller_1.fetchEChallanHandler);
// Fetch vehicle registration number using chassis number
router.post('/rc/fetch-reg-num-by-chassis', auth_1.authenticate, auth_1.requireUser, vehicle_controller_1.fetchRegNumByChassisHandler);
// Fetch FASTag details using RC number or Tag ID
router.post('/fastag/fetch-detailed', auth_1.authenticate, auth_1.requireUser, vehicle_controller_1.fetchFastagDetailsHandler);
exports.default = router;
