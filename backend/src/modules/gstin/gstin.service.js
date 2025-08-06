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
exports.GstinService = void 0;
const fetchByPan_provider_1 = require("./providers/fetchByPan.provider");
const fetchLite_provider_1 = require("./providers/fetchLite.provider");
const fetchContact_provider_1 = require("./providers/fetchContact.provider");
class GstinService {
    // Fetch GSTIN by PAN
    fetchByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchByPan_provider_1.fetchGstinByPanProvider)(payload);
        });
    }
    // Fetch GSTIN Lite
    fetchLite(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchLite_provider_1.fetchGstinLiteProvider)(payload);
        });
    }
    // Fetch GSTIN Contact Details
    fetchContact(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetchContact_provider_1.fetchGstinContactProvider)(payload);
        });
    }
}
exports.GstinService = GstinService;
