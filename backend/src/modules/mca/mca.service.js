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
exports.McaService = void 0;
const dinByPan_provider_1 = require("./providers/dinByPan.provider");
const cinByPan_provider_1 = require("./providers/cinByPan.provider");
class McaService {
    // Fetch DIN by PAN
    fetchDinByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, dinByPan_provider_1.fetchDinByPanProvider)(payload);
        });
    }
    // Fetch CIN by PAN
    fetchCinByPan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, cinByPan_provider_1.fetchCinByPanProvider)(payload);
        });
    }
}
exports.McaService = McaService;
