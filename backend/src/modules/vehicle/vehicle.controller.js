"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFastagDetailsHandler = exports.fetchRegNumByChassisHandler = exports.fetchEChallanHandler = exports.fetchRcDetailedWithChallanHandler = exports.fetchRcDetailedHandler = exports.fetchRcLiteHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const vehicle_service_1 = require("./vehicle.service");
const quota_service_1 = require("../orders/quota.service");
const service = new vehicle_service_1.VehicleService();
// POST /api/vehicle/rc/fetch-lite
// Expects body: { rc_number: string, consent: 'Y' | 'N' }
exports.fetchRcLiteHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = req.user._id;
    const { rc_number, consent } = req.body || {};
    if (!rc_number || !consent) {
        return res.status(400).json({ message: 'rc_number and consent are required' });
    }
    console.log('RC Lite Controller: incoming request', {
        userId,
        rc_number,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'vehicle');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    console.log('RC Lite Controller: using order for quota', {
        orderId: order.orderId,
        remaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        expiresAt: (_b = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _b === void 0 ? void 0 : _b.expiresAt,
    });
    const result = yield service.fetchRcLite({ rc_number, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    console.log('RC Lite Controller: consumed 1 verification', {
        orderId: order.orderId,
        newRemaining: (_c = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _c === void 0 ? void 0 : _c.remaining,
    });
    res.json(result);
}));
// POST /api/vehicle/rc/fetch-detailed
// Expects body: { rc_number: string, extract_variant?: boolean, extract_mapping?: string, extract_insurer?: string, consent: 'Y' | 'N' }
exports.fetchRcDetailedHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { rc_number, extract_variant, extract_mapping, extract_insurer, consent } = req.body || {};
    if (!rc_number || !consent) {
        return res.status(400).json({ message: 'rc_number and consent are required' });
    }
    console.log('RC Detailed Controller: incoming request', {
        userId,
        rc_number,
        extract_variant,
        extract_mapping: !!extract_mapping,
        extract_insurer: !!extract_insurer,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'vehicle');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchRcDetailed({
        rc_number,
        extract_variant,
        extract_mapping,
        extract_insurer,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/vehicle/rc/fetch-detailed-challan
// Expects body: { rc_number: string, extract_variant?: boolean, extract_mapping?: string, consent: 'Y' | 'N' }
exports.fetchRcDetailedWithChallanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { rc_number, extract_variant, extract_mapping, consent } = req.body || {};
    if (!rc_number || !consent) {
        return res.status(400).json({ message: 'rc_number and consent are required' });
    }
    console.log('RC Detailed With Challan Controller: incoming request', {
        userId,
        rc_number,
        extract_variant,
        extract_mapping: !!extract_mapping,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'vehicle');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchRcDetailedWithChallan({
        rc_number,
        extract_variant,
        extract_mapping,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/vehicle/challan/fetch
// Expects body: { rc_number: string, chassis_number: string, engine_number: string, state_portals?: string[], consent: 'Y' | 'N' }
exports.fetchEChallanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { rc_number, chassis_number, engine_number, state_portals, consent } = req.body || {};
    if (!rc_number || !chassis_number || !engine_number || !consent) {
        return res.status(400).json({
            message: 'rc_number, chassis_number, engine_number, and consent are required',
        });
    }
    console.log('E-Challan Controller: incoming request', {
        userId,
        rc_number,
        chassis_number,
        engine_number,
        state_portals,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'vehicle');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchEChallan({
        rc_number,
        chassis_number,
        engine_number,
        state_portals,
        consent,
    });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/vehicle/rc/fetch-reg-num-by-chassis
// Expects body: { chassis_number: string, consent: 'Y' | 'N' }
exports.fetchRegNumByChassisHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { chassis_number, consent } = req.body || {};
    if (!chassis_number || !consent) {
        return res.status(400).json({ message: 'chassis_number and consent are required' });
    }
    console.log('Fetch Reg Num By Chassis Controller: incoming request', {
        userId,
        chassis_number,
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'vehicle');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchRegNumByChassis({ chassis_number, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/vehicle/fastag/fetch-detailed
// Expects body: { rc_number?: string, tag_id?: string, consent: 'Y' | 'N' }
exports.fetchFastagDetailsHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { rc_number, tag_id, consent } = req.body || {};
    if (!rc_number && !tag_id) {
        return res.status(400).json({
            message: 'At least one of rc_number or tag_id is required',
        });
    }
    if (!consent) {
        return res.status(400).json({ message: 'consent is required' });
    }
    console.log('FASTag Details Controller: incoming request', {
        userId,
        rc_number: rc_number || 'N/A',
        tag_id: tag_id ? 'PROVIDED' : 'N/A',
        hasConsent: Boolean(consent),
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'vehicle');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchFastagDetails({ rc_number, tag_id, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
