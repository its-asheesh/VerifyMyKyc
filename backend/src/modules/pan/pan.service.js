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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanService = void 0;
const fatherName_provider_1 = require("./providers/fatherName.provider");
const linkCheck_provider_1 = require("./providers/linkCheck.provider");
const digilockerPull_provider_1 = require("./providers/digilockerPull.provider");
const digilockerInit_provider_1 = require("./providers/digilockerInit.provider");
const digilockerFetchDocument_provider_1 = require("./providers/digilockerFetchDocument.provider");
const fetchPanAdvance_provider_1 = require("./providers/fetchPanAdvance.provider");
const dinByPan_provider_1 = require("../mca/providers/dinByPan.provider");
const cinByPan_provider_1 = require("../mca/providers/cinByPan.provider");
const fetchByPan_provider_1 = require("../gstin/providers/fetchByPan.provider");
const fetchPanDetailed_provider_1 = require("./providers/fetchPanDetailed.provider");
class PanService {
    // Fetch Father's Name by PAN
    fetchFatherName(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fatherName_provider_1.fetchFatherNameByPanProvider)(payload);
        });
    }
    // Check PAN-Aadhaar Link
    checkPanAadhaarLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, linkCheck_provider_1.checkPanAadhaarLinkProvider)(payload);
        });
    }
    // Digilocker Init
    digilockerInit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, digilockerInit_provider_1.digilockerInitProvider)(payload);
        });
    }
    // Digilocker Pull PAN
    digilockerPull(payload, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, digilockerPull_provider_1.digilockerPullPanProvider)(payload, transactionId);
        });
    }
    // Digilocker Fetch Document
    digilockerFetchDocument(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, digilockerFetchDocument_provider_1.digilockerFetchDocumentProvider)(payload);
        });
    }
    // DIN By PAN (MCA)
    fetchDinByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, dinByPan_provider_1.fetchDinByPanProvider)(payload);
        });
    }
    // CIN By PAN (MCA)
    fetchCinByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, cinByPan_provider_1.fetchCinByPanProvider)(payload);
        });
    }
    // GSTIN By PAN (GSTIN)
    fetchGstinByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchByPan_provider_1.fetchGstinByPanProvider)(payload);
        });
    }
    // Fetch PAN Advance
    fetchPanAdvance(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchPanAdvance_provider_1.fetchPanAdvanceProvider)(payload);
        });
    }
    // Fetch PAN Detailed
    fetchPanDetailed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchPanDetailed_provider_1.fetchPanDetailedProvider)(payload);
        });
    }
}
exports.PanService = PanService;
