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
exports.PassportService = void 0;
const fetch_PassportProvider_1 = require("./provider/fetch.PassportProvider");
class PassportService {
    /**
     * Generates MRZ (Machine Readable Zone) from passport details.
     */
    generateMrz(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_PassportProvider_1.generateMrzProvider)(payload);
        });
    }
    /**
     * Verifies if the provided MRZ matches the given passport details.
     */
    verifyMrz(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_PassportProvider_1.verifyMrzProvider)(payload);
        });
    }
    /**
     * Verifies passport details (file number, DOB, name, etc.) against government database.
     */
    verifyPassport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_PassportProvider_1.verifyPassportProvider)(payload);
        });
    }
    /**
     * Fetches passport details using file number and date of birth.
     */
    fetchPassportDetails(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_PassportProvider_1.fetchPassportDetailsProvider)(payload);
        });
    }
    /**
     * Performs OCR on passport image/PDF to extract structured data.
     */
    extractPassportOcrData(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_PassportProvider_1.extractPassportOcrDataProvider)(payload);
        });
    }
}
exports.PassportService = PassportService;
