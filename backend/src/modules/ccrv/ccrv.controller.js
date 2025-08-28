"use strict";
// ccrv.controller.ts
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
exports.searchCCRVHandler = exports.fetchCCRVResultHandler = exports.generateCCRVReportHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const ccrv_service_1 = require("./ccrv.service");
const quota_service_1 = require("../orders/quota.service");
const service = new ccrv_service_1.CCRVService();
// POST /api/ccrv/generate-report
exports.generateCCRVReportHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { name, father_name, house_number, locality, city, village, state, district, pincode, date_of_birth, gender, mobile_number, email, consent, callback_url } = req.body || {};
    // Required fields validation
    if (!name || !consent) {
        return res.status(400).json({
            message: 'name and consent are required'
        });
    }
    console.log('CCRV Generate Report Controller: incoming request', {
        userId,
        name,
        hasConsent: Boolean(consent),
        callback_url: !!callback_url
    });
    // Check verification quota
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'ccrv');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    try {
        const result = yield service.generateReport({
            name,
            father_name,
            house_number,
            locality,
            city,
            village,
            state,
            district,
            pincode,
            date_of_birth,
            gender,
            mobile_number,
            email,
            consent,
            callback_url
        });
        // Consume verification quota
        yield (0, quota_service_1.consumeVerificationQuota)(order);
        console.log('CCRV Generate Report Controller: consumed 1 verification', {
            orderId: order.orderId,
            newRemaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        });
        res.json(result);
    }
    catch (error) {
        console.error('CCRV Generate Report Error:', error);
        res.status(500).json({
            message: 'Failed to generate CCRV report',
            error: error.message
        });
    }
}));
// POST /api/ccrv/fetch-result
exports.fetchCCRVResultHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { transaction_id } = req.body || {};
    // Required fields validation
    if (!transaction_id) {
        return res.status(400).json({
            message: 'transaction_id is required'
        });
    }
    console.log('CCRV Fetch Result Controller: incoming request', {
        userId,
        transaction_id,
    });
    // Check verification quota
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'ccrv');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    try {
        const result = yield service.fetchResult({
            transaction_id
        });
        // Consume verification quota
        yield (0, quota_service_1.consumeVerificationQuota)(order);
        console.log('CCRV Fetch Result Controller: consumed 1 verification', {
            orderId: order.orderId,
            newRemaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        });
        res.json(result);
    }
    catch (error) {
        console.error('CCRV Fetch Result Error:', error);
        res.status(500).json({
            message: 'Failed to fetch CCRV result',
            error: error.message
        });
    }
}));
// POST /api/ccrv/search
exports.searchCCRVHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { name, address, father_name, date_of_birth, case_category, type, name_match_type, father_match_type, jurisdiction_type, consent } = req.body || {};
    // Required fields validation
    if (!name || !address || !consent) {
        return res.status(400).json({
            message: 'name, address, and consent are required'
        });
    }
    console.log('CCRV Search Controller: incoming request', {
        userId,
        name,
        address,
        hasConsent: Boolean(consent)
    });
    // Check verification quota
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'ccrv');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    try {
        const result = yield service.search({
            name,
            address,
            father_name,
            date_of_birth,
            case_category,
            type,
            name_match_type,
            father_match_type,
            jurisdiction_type,
            consent
        });
        // Consume verification quota
        yield (0, quota_service_1.consumeVerificationQuota)(order);
        console.log('CCRV Search Controller: consumed 1 verification', {
            orderId: order.orderId,
            newRemaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        });
        res.json(result);
    }
    catch (error) {
        console.error('CCRV Search Error:', error);
        res.status(500).json({
            message: 'Failed to search CCRV records',
            error: error.message
        });
    }
}));
