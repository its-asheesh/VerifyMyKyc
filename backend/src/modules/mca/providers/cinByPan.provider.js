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
exports.fetchCinByPanProvider = fetchCinByPanProvider;
const BaseProvider_1 = require("../../../common/providers/BaseProvider");
const error_1 = require("../../../common/http/error");
function fetchCinByPanProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate required inputs as per MCA docs: pan_number and consent are required
        if (!(payload === null || payload === void 0 ? void 0 : payload.pan_number)) {
            throw new error_1.HTTPError('pan_number is required', 400);
        }
        if (!(payload === null || payload === void 0 ? void 0 : payload.consent)) {
            throw new error_1.HTTPError('consent is required', 400);
        }
        const externalPayload = {
            pan_number: payload.pan_number,
            consent: payload.consent,
            // Some providers require human-readable consent text
            //consent_text: payload.consent_text || 'User consented to fetch CIN by PAN for verification.',
        };
        return (0, BaseProvider_1.makeProviderApiCall)({
            endpoint: '/mca-api/cin-by-pan',
            payload: externalPayload,
            operationName: 'MCA CIN by PAN',
            customErrorMapper: (0, BaseProvider_1.createStandardErrorMapper)('Fetch CIN by PAN failed')
        });
    });
}
