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
exports.ccrvCallbackHandler = exports.fetchCCRVResultHandler = exports.searchCCRVHandler = exports.generateCCRVReportHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const ccrv_service_1 = require("./ccrv.service");
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new ccrv_service_1.CCRVService();
class CCRVController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/ccrv/generate-report
        this.generateCCRVReportHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, address, father_name, additional_address, date_of_birth, consent } = req.body || {};
            this.logRequest('CCRV Generate Report', req.user._id.toString(), { name, address });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'ccrv',
                requireConsent: true,
                requiredFields: ['name', 'address']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.generateReport({
                    name,
                    address,
                    father_name,
                    additional_address,
                    date_of_birth,
                    consent: consent === true ? 'Y' : consent === false ? 'N' : consent
                });
            }));
        }));
        // POST /api/ccrv/search
        this.searchCCRVHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, address, father_name, date_of_birth, case_category, type, name_match_type, father_match_type, jurisdiction_type, consent } = req.body || {};
            this.logRequest('CCRV Search', req.user._id.toString(), { name, address });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'ccrv',
                requireConsent: true,
                requiredFields: ['name', 'address']
            }, () => __awaiter(this, void 0, void 0, function* () {
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
                    consent: consent === true ? 'Y' : consent === false ? 'N' : consent
                };
                console.log('CCRV Search Payload being sent to API:', searchPayload);
                return service.search(searchPayload);
            }));
        }));
    }
}
// Create controller instance
const controller = new CCRVController();
// Export handlers
exports.generateCCRVReportHandler = controller.generateCCRVReportHandler.bind(controller);
exports.searchCCRVHandler = controller.searchCCRVHandler.bind(controller);
// POST /api/ccrv/fetch-result - No quota required (polling endpoint)
exports.fetchCCRVResultHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { transaction_id } = req.body || {};
    if (!transaction_id) {
        return res.status(400).json({ message: 'transaction_id is required' });
    }
    console.log('CCRV Fetch Result Controller: incoming request', {
        userId,
        transaction_id,
    });
    try {
        const result = yield service.fetchResult({ transaction_id });
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
        yield service.handleCallback({
            transactionId,
            referenceId,
            payload,
        });
        return res.status(200).json({ received: true, transactionId });
    }
    catch (error) {
        console.error('CCRV Callback Processing Error:', error);
        return res.status(500).json({ error: 'Failed to process callback' });
    }
});
exports.ccrvCallbackHandler = ccrvCallbackHandler;
