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
exports.ccrvCallbackHandler = exports.searchCCRVHandler = exports.fetchCCRVResultHandler = exports.generateCCRVReportHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const ccrv_service_1 = require("./ccrv.service");
const quota_service_1 = require("../orders/quota.service");
const service = new ccrv_service_1.CCRVService();
// POST /api/ccrv/generate-report
exports.generateCCRVReportHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user._id;
    const { name, father_name, house_number, locality, city, village, state, district, pincode, date_of_birth, gender, mobile_number, email, consent } = req.body || {};
    // Automatically set callback URL - users don't need to provide this
    const callback_url = 'https://verifymykyc.com/api/ccrv/callback';
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
        callback_url: callback_url
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
            consent: consent === true ? 'Y' : consent === false ? 'N' : consent, // Ensure consent is 'Y' or 'N'
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
    try {
        const result = yield service.fetchResult({
            transaction_id
        });
        // Don't consume quota for polling - quota was already consumed during the initial search
        console.log('CCRV Fetch Result Controller: fetched result without consuming quota (polling)');
        console.log('CCRV Fetch Result Data:', JSON.stringify(result, null, 2));
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
    // Validate consent format
    if (consent !== 'Y' && consent !== 'N') {
        return res.status(400).json({
            message: 'consent must be either "Y" or "N"'
        });
    }
    console.log('CCRV Search Controller: incoming request', {
        userId,
        name,
        address,
        consent,
        consentType: typeof consent,
        hasConsent: Boolean(consent),
        fullBody: req.body
    });
    // Check verification quota
    const order = yield (0, quota_service_1.ensureVerificationQuota)(userId, 'ccrv');
    if (!order)
        return res.status(403).json({ message: 'Verification quota exhausted or expired' });
    try {
        const searchPayload = {
            name,
            address,
            father_name,
            date_of_birth,
            case_category,
            type,
            name_match_type,
            father_match_type,
            jurisdiction_type,
            consent: consent === true ? 'Y' : consent === false ? 'N' : consent // Ensure consent is 'Y' or 'N'
        };
        console.log('CCRV Search Payload being sent to API:', searchPayload);
        const result = yield service.search(searchPayload);
        // Consume verification quota
        yield (0, quota_service_1.consumeVerificationQuota)(order);
        console.log('CCRV Search Controller: consumed 1 verification', {
            orderId: order.orderId,
            newRemaining: (_a = order === null || order === void 0 ? void 0 : order.verificationQuota) === null || _a === void 0 ? void 0 : _a.remaining,
        });
        console.log('CCRV Search Result Data:', JSON.stringify(result, null, 2));
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
/**
 * PUBLIC: Callback handler for OnGrid CCRV API
 * This is where OnGrid sends the result when the report is ready
 */
const ccrvCallbackHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.headers['x-transaction-id'];
    const referenceId = req.headers['x-reference-id'];
    const authType = req.headers['x-auth-type'];
    const payload = req.body;
    console.log('✅ CCRV Callback Received', {
        transactionId,
        referenceId,
        authType,
        payload,
    });
    try {
        // Pass to service for processing (e.g., save to DB, notify user)
        yield service.handleCallback({
            transactionId,
            referenceId,
            payload,
        });
        // ✅ Acknowledge receipt
        return res.status(200).json({ received: true, transactionId });
    }
    catch (error) {
        console.error('CCRV Callback Processing Error:', error);
        return res.status(500).json({ error: 'Failed to process callback' });
    }
});
exports.ccrvCallbackHandler = ccrvCallbackHandler;
