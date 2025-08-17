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
exports.VoterService = void 0;
const bosonFetch_provider_1 = require("./providers/bosonFetch.provider");
const mesonInit_provider_1 = require("./providers/mesonInit.provider");
const mesonFetch_provider_1 = require("./providers/mesonFetch.provider");
const ocr_provider_1 = require("./providers/ocr.provider");
class VoterService {
    bosonFetch(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, bosonFetch_provider_1.voterBosonFetchProvider)(payload);
        });
    }
    mesonInit() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mesonInit_provider_1.voterMesonInitProvider)();
        });
    }
    mesonFetch(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, mesonFetch_provider_1.voterMesonFetchProvider)(payload);
        });
    }
    ocr(file_front, file_front_name, consent, file_back, file_back_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, ocr_provider_1.voterOcrProvider)(file_front, file_front_name, consent, file_back, file_back_name);
        });
    }
}
exports.VoterService = VoterService;
