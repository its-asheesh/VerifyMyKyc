import { fetchRcLiteDetailsProvider } from './provider/fetch.RcProvider';
import { fetchRcDetailedProvider } from './provider/fetch.RcProvider';
import { fetchRcDetailedWithChallanProvider } from './provider/fetch.RcProvider';
import { fetchEChallanProvider } from './provider/fetch.RcProvider';
import { fetchRegNumByChassisProvider } from './provider/fetch.RcProvider';
import { fetchFastagDetailsProvider } from './provider/fetch.RcProvider';

// Import request types
import {
  RcFetchLiteRequest,
  RcFetchDetailedRequest,
  RcFetchDetailedChallanRequest,
  RcEchallanFetchRequest,
  RcFetchRegNumByChassisRequest,
  RcFastagFetchRequest,
} from '../../common/types/vehicle';

export class VehicleService {
  /**
   * Fetches basic RC (Registration Certificate) details.
   */
  async fetchRcLite(payload: RcFetchLiteRequest) {
    return fetchRcLiteDetailsProvider(payload);
  }

  /**
   * Fetches detailed RC registration information.
   */
  async fetchRcDetailed(payload: RcFetchDetailedRequest) {
    return fetchRcDetailedProvider(payload);
  }

  /**
   * Fetches detailed RC information along with linked challans.
   */
  async fetchRcDetailedWithChallan(payload: RcFetchDetailedChallanRequest) {
    return fetchRcDetailedWithChallanProvider(payload);
  }

  /**
   * Fetches e-challan details using RC, chassis, and engine number.
   */
  async fetchEChallan(payload: RcEchallanFetchRequest) {
    return fetchEChallanProvider(payload);
  }

  /**
   * Fetches vehicle registration number using chassis number.
   */
  async fetchRegNumByChassis(payload: RcFetchRegNumByChassisRequest) {
    return fetchRegNumByChassisProvider(payload);
  }

  /**
   * Fetches FASTag details using RC number or Tag ID.
   */
  async fetchFastagDetails(payload: RcFastagFetchRequest) {
    return fetchFastagDetailsProvider(payload);
  }
}