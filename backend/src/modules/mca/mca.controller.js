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
exports.fetchCompanyHandler = exports.fetchCinByPanHandler = exports.fetchDinByPanHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const mca_service_1 = require("./mca.service");
const quota_service_1 = require("../orders/quota.service");
const service = new mca_service_1.McaService();
// POST /api/mca/fetch-din-by-pan
exports.fetchDinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    // Prefer consuming from 'company' quota; fallback to 'pan' to support PAN flows using MCA lookups
    let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'company');
    if (!order) {
        order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    }
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
    const result = yield service.fetchDinByPan(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/mca/cin-by-pan
exports.fetchCinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    // Prefer 'company' quota; fallback to 'pan' for PAN product usage
    let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'company');
    if (!order) {
        order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    }
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
    const result = yield service.fetchCinByPan(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/mca/fetch-company
exports.fetchCompanyHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    // Prefer 'company' quota; fallback to 'pan' if PAN plan includes company fetch usage
    let order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'company');
    if (!order) {
        order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'pan');
    }
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired for company or pan' });
    const result = yield service.fetchCompany(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
