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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.digilockerFetchDocumentHandler = exports.digilockerPullHandler = exports.digilockerInitHandler = exports.checkPanAadhaarLinkHandler = exports.fetchCinByPanHandler = exports.fetchDinByPanHandler = exports.fetchGstinByPanHandler = exports.fetchFatherNameHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const pan_service_1 = require("./pan.service");
const quota_service_1 = require("../orders/quota.service");
const service = new pan_service_1.PanService();
// POST /api/pan/father-name
// Expects body: { pan_number: string, consent: string }
exports.fetchFatherNameHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = req.user._id;
    const { pan_number, consent } = req.body || {};
    // Basic payload validation to prevent avoidable 500s
    if (!pan_number || !consent) {
        return res.status(400).json({ message: 'pan_number and consent are required' });
    }
    console.log('PAN Father-Name Controller: incoming request', {
        userId,
        pan_number,
        hasConsent: Boolean(consent)
    });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    console.log('PAN Father-Name Controller: using order for quota', {
        orderId: order.orderId,
        remaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        expiresAt: (_b = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _b === void 0 ? void 0 : _b.expiresAt,
    });
    const result = yield service.fetchFatherName({ pan_number, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    console.log('PAN Father-Name Controller: consumed 1 verification', {
        orderId: order.orderId,
        newRemaining: (_c = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _c === void 0 ? void 0 : _c.remaining,
    });
    res.json(result);
}));
// POST /api/pan/gstin-by-pan
// Expects body: { pan_number: string, consent: string }
exports.fetchGstinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { pan_number, consent } = req.body || {};
    if (!pan_number || !consent) {
        return res.status(400).json({ message: 'pan_number and consent are required' });
    }
    console.log('PAN GSTIN-by-PAN Controller: incoming request', { userId, pan_number });
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchGstinByPan({ pan_number, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/pan/din-by-pan
// Expects body: { pan_number: string, consent: string }
exports.fetchDinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { pan_number, consent } = req.body || {};
    if (!pan_number || !consent) {
        return res.status(400).json({ message: 'pan_number and consent are required' });
    }
    console.log('PAN DIN-by-PAN Controller: incoming request', { userId, pan_number });
    // Prefer company quota (MCA), fallback to pan
    let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'company');
    if (!order)
        order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
    const result = yield service.fetchDinByPan({ pan_number, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/pan/cin-by-pan
// Expects body: { pan_number: string, consent: 'Y' | 'N' } (also accepts { pan: string } for backward compatibility)
exports.fetchCinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = req.user._id;
    const pan_number = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pan_number) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.pan);
    const consent = (_c = req.body) === null || _c === void 0 ? void 0 : _c.consent;
    if (!pan_number || !consent) {
        return res.status(400).json({ message: 'pan_number and consent are required' });
    }
    console.log('PAN CIN-by-PAN Controller: incoming request', { userId, pan_number });
    // Prefer company quota (MCA), fallback to pan
    let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'company');
    if (!order)
        order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
    const result = yield service.fetchCinByPan({ pan_number, consent });
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/pan/aadhaar-link
// Expects body: { pan_number: string, aadhaar_number: string, consent: string }
exports.checkPanAadhaarLinkHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.checkPanAadhaarLink(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/pan/digilocker-init
// Expects body: { redirect_uri: string, consent: string }
exports.digilockerInitHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service.digilockerInit(req.body);
    res.json(result);
}));
// POST /api/pan/digilocker-pull
// Expects body: { parameters: { panno: string, PANFullName: string }, transactionId: string }
exports.digilockerPullHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { transactionId } = _a, payload = __rest(_a, ["transactionId"]);
    const result = yield service.digilockerPull(payload, transactionId);
    res.json(result);
}));
// POST /api/pan/digilocker-fetch-document
// Expects body: { document_uri: string, transaction_id: string }
exports.digilockerFetchDocumentHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.digilockerFetchDocument(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
