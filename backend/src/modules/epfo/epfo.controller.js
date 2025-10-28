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
const epfo_service_1 = require("./epfo.service");
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new epfo_service_1.EpfoService();
class EpfoController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/epfo/fetch-uan
        this.fetchUanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchUan(req.body);
            }));
        }));
        // POST /api/epfo/passbook/generate-otp
        this.generateOtpHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.generateOtp(req.body);
            }));
        }));
        // POST /api/epfo/passbook/validate-otp
        this.validateOtpHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.validateOtp(req.headers['x-transaction-id'], req.body);
            }));
        }));
        // GET /api/epfo/passbook/employers
        this.listEmployersHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.listEmployers(req.headers['x-transaction-id']);
            }));
        }));
        // POST /api/epfo/passbook/fetch
        this.fetchPassbookHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchPassbook(req.headers['x-transaction-id'], req.body);
            }));
        }));
        // POST /api/epfo/employment-history/fetch-by-uan
        this.employmentByUanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchEmploymentByUan(req.body);
            }));
        }));
        // POST /api/epfo/employment-history/fetch-latest
        this.employmentLatestHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchLatestEmployment(req.body);
            }));
        }));
        // POST /api/epfo/uan/fetch-by-pan
        this.uanByPanHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchUanByPan(req.body);
            }));
        }));
        // POST /api/epfo/employer-verify
        this.employerVerifyHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'epfo'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.verifyEmployer(req.body);
            }));
        }));
    }
}
// Create controller instance and export handlers
const controller = new EpfoController();
exports.fetchUanHandler = controller.fetchUanHandler.bind(controller);
exports.generateOtpHandler = controller.generateOtpHandler.bind(controller);
exports.validateOtpHandler = controller.validateOtpHandler.bind(controller);
exports.listEmployersHandler = controller.listEmployersHandler.bind(controller);
exports.fetchPassbookHandler = controller.fetchPassbookHandler.bind(controller);
exports.employmentByUanHandler = controller.employmentByUanHandler.bind(controller);
exports.employmentLatestHandler = controller.employmentLatestHandler.bind(controller);
exports.uanByPanHandler = controller.uanByPanHandler.bind(controller);
exports.employerVerifyHandler = controller.employerVerifyHandler.bind(controller);
