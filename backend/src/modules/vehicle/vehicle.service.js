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
exports.VehicleService = void 0;
const fetch_RcProvider_1 = require("./provider/fetch.RcProvider");
const fetch_RcProvider_2 = require("./provider/fetch.RcProvider");
const fetch_RcProvider_3 = require("./provider/fetch.RcProvider");
const fetch_RcProvider_4 = require("./provider/fetch.RcProvider");
const fetch_RcProvider_5 = require("./provider/fetch.RcProvider");
const fetch_RcProvider_6 = require("./provider/fetch.RcProvider");
class VehicleService {
    /**
     * Fetches basic RC (Registration Certificate) details.
     */
    fetchRcLite(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_RcProvider_1.fetchRcLiteDetailsProvider)(payload);
        });
    }
    /**
     * Fetches detailed RC registration information.
     */
    fetchRcDetailed(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_RcProvider_2.fetchRcDetailedProvider)(payload);
        });
    }
    /**
     * Fetches detailed RC information along with linked challans.
     */
    fetchRcDetailedWithChallan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_RcProvider_3.fetchRcDetailedWithChallanProvider)(payload);
        });
    }
    /**
     * Fetches e-challan details using RC, chassis, and engine number.
     */
    fetchEChallan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_RcProvider_4.fetchEChallanProvider)(payload);
        });
    }
    /**
     * Fetches vehicle registration number using chassis number.
     */
    fetchRegNumByChassis(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_RcProvider_5.fetchRegNumByChassisProvider)(payload);
        });
    }
    /**
     * Fetches FASTag details using RC number or Tag ID.
     */
    fetchFastagDetails(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, fetch_RcProvider_6.fetchFastagDetailsProvider)(payload);
        });
    }
}
exports.VehicleService = VehicleService;
