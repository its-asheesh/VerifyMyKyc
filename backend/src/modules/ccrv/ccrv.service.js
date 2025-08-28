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
exports.CCRVService = void 0;
const fetch_CcrvProvider_1 = require("./provider/fetch.CcrvProvider");
class CCRVService {
    /**
     * Generates a CCRV report for criminal case record verification.
     * This API initiates the CCRV verification process and returns a transaction ID.
     */
    generateReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_CcrvProvider_1.generateCCRVReportProvider)(payload);
        });
    }
    /**
     * Fetches the CCRV result using the transaction ID.
     * This API is used to get the status of verification or the final result.
     */
    fetchResult(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_CcrvProvider_1.fetchCCRVResultProvider)(payload);
        });
    }
    /**
     * Searches for CCRV records based on name and address.
     * This API initiates a search for criminal case records.
     */
    search(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_CcrvProvider_1.searchCCRVProvider)(payload);
        });
    }
}
exports.CCRVService = CCRVService;
