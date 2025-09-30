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
exports.employerVerifyHandler = exports.uanByPanHandler = exports.employmentLatestHandler = exports.employmentByUanHandler = exports.fetchPassbookHandler = exports.listEmployersHandler = exports.validateOtpHandler = exports.generateOtpHandler = exports.fetchUanHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const quota_service_1 = require("../orders/quota.service");
const epfo_service_1 = require("./epfo.service");
const service = new epfo_service_1.EpfoService();
// POST /api/epfo/fetch-uan
exports.fetchUanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchUan(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/passbook/generate-otp
exports.generateOtpHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.generateOtp(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/passbook/validate-otp
exports.validateOtpHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.validateOtp(req.headers['x-transaction-id'], req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// GET /api/epfo/passbook/employers
exports.listEmployersHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.listEmployers(req.headers['x-transaction-id']);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/passbook/fetch
exports.fetchPassbookHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchPassbook(req.headers['x-transaction-id'], req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/employment-history/fetch-by-uan
exports.employmentByUanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchEmploymentByUan(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/employment-history/fetch-latest
exports.employmentLatestHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchLatestEmployment(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/uan/fetch-by-pan
exports.uanByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.fetchUanByPan(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
// POST /api/epfo/employer-verify
exports.employerVerifyHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'epfo');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    const result = yield service.verifyEmployer(req.body);
    yield (0, quota_service_1.consumeVerificationQuota)(order);
    res.json(result);
}));
