import BaseApi from './baseApi';
import type {
  RcFetchLiteRequest,
  RcFetchLiteResponse,
  RcFetchDetailedRequest,
  RcFetchDetailedResponse,
  RcFetchDetailedChallanRequest,
  RcFetchDetailedChallanResponse,
  RcEchallanFetchRequest,
  RcEchallanFetchResponse,
  RcFetchRegNumByChassisRequest,
  RcFetchRegNumByChassisResponse,
  RcFastagFetchRequest,
  RcFastagFetchResponse,
} from '../../types/kyc';

class RcApi extends BaseApi {
  /**
   * Fetch basic RC (Registration Certificate) details.
   */
  async fetchLite(data: RcFetchLiteRequest): Promise<RcFetchLiteResponse> {
    return this.post('/vehicle/rc/fetch-lite', data);
  }

  /**
   * Fetch detailed RC registration information.
   */
  async fetchDetailed(data: RcFetchDetailedRequest): Promise<RcFetchDetailedResponse> {
    return this.post('/vehicle/rc/fetch-detailed', data);
  }

  /**
   * Fetch detailed RC info along with linked e-challans.
   */
  async fetchDetailedWithChallan(
    data: RcFetchDetailedChallanRequest
  ): Promise<RcFetchDetailedChallanResponse> {
    return this.post('/vehicle/rc/fetch-detailed-challan', data);
  }

  /**
   * Fetch e-challan details using RC, chassis, and engine number.
   */
  async fetchEChallan(data: RcEchallanFetchRequest): Promise<RcEchallanFetchResponse> {
    return this.post('/vehicle/challan/fetch', data);
  }

  /**
   * Fetch vehicle registration number using chassis number.
   */
  async fetchRegNumByChassis(
    data: RcFetchRegNumByChassisRequest
  ): Promise<RcFetchRegNumByChassisResponse> {
    return this.post('/vehicle/rc/fetch-reg-num-by-chassis', data);
  }

  /**
   * Fetch FASTag details using RC number or Tag ID.
   */
  async fetchFastagDetails(data: RcFastagFetchRequest): Promise<RcFastagFetchResponse> {
    return this.post('/vehicle/fastag/fetch-detailed', data);
  }

  // Public post method for generic use (inherited from BaseApi)
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config);
  }
}

export const rcApi = new RcApi('/api');