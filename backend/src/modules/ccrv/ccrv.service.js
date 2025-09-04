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
const logger_1 = require("../../common/utils/logger");
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
    handleCallback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const { transactionId, referenceId, payload } = data;
            // Log for audit
            (0, logger_1.logToFile)('ccrv-callbacks', {
                timestamp: new Date().toISOString(),
                transactionId,
                referenceId,
                code: (_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.code,
                status: (_b = payload === null || payload === void 0 ? void 0 : payload.data) === null || _b === void 0 ? void 0 : _b.ccrv_status,
                result: (_e = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c.ccrv_data) === null || _d === void 0 ? void 0 : _d.report_status) === null || _e === void 0 ? void 0 : _e.result,
            });
            const code = (_f = payload === null || payload === void 0 ? void 0 : payload.data) === null || _f === void 0 ? void 0 : _f.code;
            const result = (_j = (_h = (_g = payload === null || payload === void 0 ? void 0 : payload.data) === null || _g === void 0 ? void 0 : _g.ccrv_data) === null || _h === void 0 ? void 0 : _h.report_status) === null || _j === void 0 ? void 0 : _j.result;
            // 🔍 Business Logic
            if (code === '1004' && result === 'SUCCESS') {
                console.log(`🎉 CCRV SUCCESS for ${transactionId}`);
                // ➕ Update DB, notify user via email/SMS, trigger webhook
                // await updateUserVerificationStatus(transactionId, 'completed');
                // await sendEmailNotification(userId, 'ccrv_success', payload);
            }
            else if (['1006', '1008', '1010'].includes(code)) {
                console.log(`⚠️ CCRV ${code} for ${transactionId}:`, (_k = payload === null || payload === void 0 ? void 0 : payload.data) === null || _k === void 0 ? void 0 : _k.message);
                // ➕ Handle failure or UTV
            }
            else {
                console.log(`📌 CCRV In Progress or Unknown: ${code}`);
            }
            // Optionally: store full payload in DB
            // await db.ccrvCallbacks.create({ transactionId, payload });
        });
    }
}
exports.CCRVService = CCRVService;
