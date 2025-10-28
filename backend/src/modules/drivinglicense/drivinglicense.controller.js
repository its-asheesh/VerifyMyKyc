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
exports.fetchDrivingLicenseDetailsHandler = exports.drivingLicenseOcrHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const drivinglicense_service_1 = require("./drivinglicense.service");
const BaseController_1 = require("../../common/controllers/BaseController");
const service = new drivinglicense_service_1.DrivingLicenseService();
class DrivingLicenseController extends BaseController_1.BaseController {
    constructor() {
        super(...arguments);
        // POST /api/drivinglicense/ocr
        this.drivingLicenseOcrHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleFileUploadRequest(req, res, {
                verificationType: 'drivinglicense',
                requireConsent: true
            }, (files) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { consent } = req.body;
                return service.ocr(files.file_front.buffer, files.file_front.originalname, consent, (_a = files.file_back) === null || _a === void 0 ? void 0 : _a.buffer, (_b = files.file_back) === null || _b === void 0 ? void 0 : _b.originalname);
            }));
        }));
        // POST /api/drivinglicense/fetch-details
        this.fetchDrivingLicenseDetailsHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.handleVerificationRequest(req, res, {
                verificationType: 'drivinglicense'
            }, () => __awaiter(this, void 0, void 0, function* () {
                return service.fetchDetails(req.body);
            }));
        }));
    }
}
// Create controller instance and export handlers
const controller = new DrivingLicenseController();
exports.drivingLicenseOcrHandler = controller.drivingLicenseOcrHandler.bind(controller);
exports.fetchDrivingLicenseDetailsHandler = controller.fetchDrivingLicenseDetailsHandler.bind(controller);
