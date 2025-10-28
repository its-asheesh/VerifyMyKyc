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
exports.voterMesonFetchProvider = voterMesonFetchProvider;
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
const error_1 = require("../../../common/http/error");
function voterMesonFetchProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validation
        if (payload.consent !== 'Y') {
            throw new error_1.HTTPError('Consent is required to fetch Voter details', 400);
        }
        const voterIdRegex = /^[A-Z0-9]{10}$/i;
        if (!voterIdRegex.test(payload.voter_id)) {
            throw new error_1.HTTPError('Invalid Voter ID format', 400);
        }
        if (!payload.transaction_id) {
            throw new error_1.HTTPError('transaction_id is required for Meson fetch', 400);
        }
        return (0, BaseProvider_1.makeProviderApiCall)({
            endpoint: '/voter-api/meson/fetch',
            payload,
            operationName: 'Voter Meson Fetch',
            customErrorMapper: (0, BaseProvider_1.createStandardErrorMapper)('Fetch Voter details (Meson) failed')
        });
    });
}
