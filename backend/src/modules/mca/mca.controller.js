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
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new mca_service_1.McaService();
class McaController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/mca/fetch-din-by-pan
        this.fetchDinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // Prefer 'company' quota; fallback to 'pan'
            yield this.handleVerificationWithFallback(req, res, 'company', ['pan'], () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchDinByPan(req.body);
            }));
        }));
        // POST /api/mca/cin-by-pan
        this.fetchCinByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // Prefer 'company' quota; fallback to 'pan'
            yield this.handleVerificationWithFallback(req, res, 'company', ['pan'], () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchCinByPan(req.body);
            }));
        }));
        // POST /api/mca/fetch-company
        this.fetchCompanyHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // Prefer 'company' quota; fallback to 'pan'
            yield this.handleVerificationWithFallback(req, res, 'company', ['pan'], () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchCompany(req.body);
            }));
        }));
    }
}
// Create controller instance and export handlers
const controller = new McaController();
exports.fetchDinByPanHandler = controller.fetchDinByPanHandler.bind(controller);
exports.fetchCinByPanHandler = controller.fetchCinByPanHandler.bind(controller);
exports.fetchCompanyHandler = controller.fetchCompanyHandler.bind(controller);
