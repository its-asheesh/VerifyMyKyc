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
exports.digilockerFetchDocumentHandler = exports.digilockerPullHandler = exports.digilockerInitHandler = exports.checkPanAadhaarLinkHandler = exports.fetchFatherNameHandler = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const pan_service_1 = require("./pan.service");
const service = new pan_service_1.PanService();
// POST /api/pan/father-name
// Expects body: { pan_number: string, consent: string }
exports.fetchFatherNameHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service.fetchFatherName(req.body);
    res.json(result);
}));
// POST /api/pan/aadhaar-link
// Expects body: { pan_number: string, aadhaar_number: string, consent: string }
exports.checkPanAadhaarLinkHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service.checkPanAadhaarLink(req.body);
    res.json(result);
}));
// POST /api/pan/digilocker-init
// Expects body: { redirect_uri: string, consent: string }
exports.digilockerInitHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service.digilockerInit(req.body);
    res.json(result);
}));
// POST /api/pan/digilocker-pull
// Expects body: { parameters: { panno: string, PANFullName: string }, transactionId: string }
exports.digilockerPullHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { transactionId } = _a, payload = __rest(_a, ["transactionId"]);
    const result = yield service.digilockerPull(payload, transactionId);
    res.json(result);
}));
// POST /api/pan/digilocker-fetch-document
// Expects body: { document_uri: string, transaction_id: string }
exports.digilockerFetchDocumentHandler = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service.digilockerFetchDocument(req.body);
    res.json(result);
}));
