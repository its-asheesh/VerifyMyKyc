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
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new gstin_service_1.GstinService();
class GstinController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/gstin/fetch-by-pan
        // Uses gstin quota with pan as fallback
        this.fetchGstinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationWithFallback(req, res, 'gstin', ['pan'], () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchByPan(req.body);
            }));
        }));
        // POST /api/gstin/fetch-lite
        // Expects body: { gstin: string, consent: string }
        this.fetchGstinLiteHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'gstin',
                requireConsent: true,
                requiredFields: ['gstin']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchLite(req.body);
            }));
        }));
        // POST /api/gstin/fetch-contact
        // Expects body: { gstin: string, consent: string }
        this.fetchGstinContactHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'gstin',
                requireConsent: true,
                requiredFields: ['gstin']
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchContact(req.body);
            }));
        }));
    }
}
// Create controller instance and export handlers
const controller = new GstinController();
exports.fetchGstinByPanHandler = controller.fetchGstinByPanHandler.bind(controller);
exports.fetchGstinLiteHandler = controller.fetchGstinLiteHandler.bind(controller);
exports.fetchGstinContactHandler = controller.fetchGstinContactHandler.bind(controller);
