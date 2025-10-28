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
exports.digilockerPullHandler = exports.digilockerInitHandler = exports.fetchPanDetailedHandler = exports.fetchPanAdvanceHandler = exports.digilockerFetchDocumentHandler = exports.checkPanAadhaarLinkHandler = exports.fetchCinByPanHandler = exports.fetchDinByPanHandler = exports.fetchGstinByPanHandler = exports.fetchFatherNameHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const pan_service_1 = require("./pan.service");
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new pan_service_1.PanService();
class PanController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/pan/father-name
        this.fetchFatherNameHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { pan_number, consent } = req.body || {};
            this.logRequest('PAN Father-Name', req.user._id.toString(), { pan_number });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'pan',
                requireConsent: true,
                requiredFields: ['pan_number']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchFatherName({ pan_number, consent });
            }));
        }));
        // POST /api/pan/gstin-by-pan
        this.fetchGstinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { pan_number, consent } = req.body || {};
            this.logRequest('PAN GSTIN-by-PAN', req.user._id.toString(), { pan_number });
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'pan',
                requireConsent: true,
                requiredFields: ['pan_number']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchGstinByPan({ pan_number, consent });
            }));
        }));
        // POST /api/pan/din-by-pan
        this.fetchDinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { pan_number, consent } = req.body || {};
            this.logRequest('PAN DIN-by-PAN', req.user._id.toString(), { pan_number });
            // Uses fallback quota handling (company -> pan)
            yield this.handleVerificationWithFallback(req, res, 'company', ['pan'], () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchDinByPan({ pan_number, consent });
            }));
        }));
        // POST /api/pan/cin-by-pan
        this.fetchCinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const pan_number = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pan_number) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.pan);
            const consent = (_c = req.body) === null || _c === void 0 ? void 0 : _c.consent;
            this.logRequest('PAN CIN-by-PAN', req.user._id.toString(), { pan_number });
            // Uses fallback quota handling (company -> pan)
            yield this.handleVerificationWithFallback(req, res, 'company', ['pan'], () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchCinByPan({ pan_number, consent });
            }));
        }));
        // POST /api/pan/aadhaar-link
        this.checkPanAadhaarLinkHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            this.logRequest('PAN Aadhaar-Link', req.user._id.toString());
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'pan',
                requireConsent: true,
                requiredFields: ['pan_number', 'aadhaar_number']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.checkPanAadhaarLink(req.body);
            }));
        }));
        // POST /api/pan/digilocker-fetch-document
        this.digilockerFetchDocumentHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'pan',
                requiredFields: ['document_uri', 'transaction_id']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.digilockerFetchDocument(req.body);
            }));
        }));
        // POST /api/pan/fetch-advanced
        this.fetchPanAdvanceHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'pan',
                requireConsent: true,
                requiredFields: ['pan_number']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchPanAdvance(req.body);
            }));
        }));
        // POST /api/pan/fetch-detailed
        this.fetchPanDetailedHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'pan',
                requireConsent: true,
                requiredFields: ['pan_number']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchPanDetailed(req.body);
            }));
        }));
    }
}
// Create controller instance
const controller = new PanController();
// Export handlers
exports.fetchFatherNameHandler = controller.fetchFatherNameHandler.bind(controller);
exports.fetchGstinByPanHandler = controller.fetchGstinByPanHandler.bind(controller);
exports.fetchDinByPanHandler = controller.fetchDinByPanHandler.bind(controller);
exports.fetchCinByPanHandler = controller.fetchCinByPanHandler.bind(controller);
exports.checkPanAadhaarLinkHandler = controller.checkPanAadhaarLinkHandler.bind(controller);
exports.digilockerFetchDocumentHandler = controller.digilockerFetchDocumentHandler.bind(controller);
exports.fetchPanAdvanceHandler = controller.fetchPanAdvanceHandler.bind(controller);
exports.fetchPanDetailedHandler = controller.fetchPanDetailedHandler.bind(controller);
// Handlers without quota (digilocker-init and digilocker-pull)
// POST /api/pan/digilocker-init
exports.digilockerInitHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service.digilockerInit(req.body);
    res.json(result);
}));
// POST /api/pan/digilocker-pull
exports.digilockerPullHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { transactionId } = _a, payload = __rest(_a, ["transactionId"]);
    const result = yield service.digilockerPull(payload, transactionId);
    res.json(result);
}));
