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
exports.fetchGstinByPanProvider = fetchGstinByPanProvider;
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
function fetchGstinByPanProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Transform payload to match external API format
        const externalPayload = {
            pan_number: payload.pan_number,
            consent: payload.consent
        };
        return (0, BaseProvider_1.makeProviderApiCall)({
            endpoint: '/gstin-api/fetch-by-pan',
            payload: externalPayload,
            operationName: 'GSTIN by PAN',
            customErrorMapper: (0, BaseProvider_1.createStandardErrorMapper)('Fetch GSTIN by PAN failed')
        });
    });
}
