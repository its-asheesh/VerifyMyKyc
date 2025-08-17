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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voterBosonFetchProvider = voterBosonFetchProvider;
const apiClient_1 = __importDefault(require("../../../common/http/apiClient"));
const error_1 = require("../../../common/http/error");
function voterBosonFetchProvider(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            if (payload.consent !== 'Y') {
                throw new error_1.HTTPError('Consent is required to fetch Voter details', 400);
            }
            const voterIdRegex = /^[A-Z0-9]{10}$/i;
            if (!voterIdRegex.test(payload.voter_id)) {
                throw new error_1.HTTPError('Invalid Voter ID format', 400);
            }
            const response = yield apiClient_1.default.post('/voter-api/boson/fetch', payload);
            return response.data;
        }
        catch (error) {
            throw new error_1.HTTPError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Fetch Voter details (Boson) failed', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500, (_d = error.response) === null || _d === void 0 ? void 0 : _d.data);
        }
    });
}
