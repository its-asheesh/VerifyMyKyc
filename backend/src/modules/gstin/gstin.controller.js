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
exports.fetchGstinContactHandler = exports.fetchGstinLiteHandler = exports.fetchGstinByPanHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const gstin_service_1 = require("./gstin.service");
const quota_service_1 = require("../orders/quota.service");
const service = new gstin_service_1.GstinService();
// POST /api/gstin/fetch-by-pan
exports.fetchGstinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    // Prefer GSTIN quota, but allow PAN quota fallback so the same feature works from either module
    let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'gstin');
    if (!order) {
        order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    }
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired for gstin or pan' });
    const result = yield service.fetchByPan(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/gstin/fetch-lite
// Expects body: { gstin: string, consent: string }
exports.fetchGstinLiteHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'gstin');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchLite(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/gstin/fetch-contact
// Expects body: { gstin: string, consent: string }
exports.fetchGstinContactHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'gstin');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchContact(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
