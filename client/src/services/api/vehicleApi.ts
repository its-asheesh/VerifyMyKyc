import BaseApi from './baseApi';
import type { AxiosRequestConfig } from 'axios';
import type {
    RcFetchLiteRequest,
    RcFetchLiteResponse,
    RcEchallanFetchRequest,
    RcEchallanFetchResponse,
    RcFetchRegNumByChassisRequest,
    RcFetchRegNumByChassisResponse,
    RcFastagFetchRequest,
    RcFastagFetchResponse,
    CCRVGenerateReportRequest,
    CCRVGenerateReportResponse,
    CCRVFetchResultRequest,
    CCRVFetchResultResponse,
    CCRVSearchRequest,
    CCRVSearchResponse,
} from '../../types/kyc';

class VehicleApi extends BaseApi {
    // ---------------------------------------------------------------------------
    // RC Services
    // ---------------------------------------------------------------------------
    /**
     * Fetch basic RC (Registration Certificate) details.
     */
    async rcFetchLite(data: RcFetchLiteRequest): Promise<RcFetchLiteResponse> {
        return this.post('/vehicle/rc/fetch-lite', data);
    }

    /**
     * Fetch e-challan details using RC, chassis, and engine number.
     */
    async rcFetchEChallan(data: RcEchallanFetchRequest): Promise<RcEchallanFetchResponse> {
        return this.post('/vehicle/challan/fetch', data);
    }

    /**
     * Fetch vehicle registration number using chassis number.
     */
    async rcFetchRegNumByChassis(
        data: RcFetchRegNumByChassisRequest
    ): Promise<RcFetchRegNumByChassisResponse> {
        return this.post('/vehicle/rc/fetch-reg-num-by-chassis', data);
    }

    /**
     * Fetch FASTag details using RC number or Tag ID.
     */
    async rcFetchFastagDetails(data: RcFastagFetchRequest): Promise<RcFastagFetchResponse> {
        return this.post('/vehicle/fastag/fetch-detailed', data);
    }

    // ---------------------------------------------------------------------------
    // CCRV Services
    // ---------------------------------------------------------------------------
    /**
     * Generate a CCRV report for criminal case record verification.
     */
    async ccrvGenerateReport(data: CCRVGenerateReportRequest): Promise<CCRVGenerateReportResponse> {
        return this.post('/ccrv/generate-report', data);
    }

    /**
     * Fetch the CCRV result using the transaction ID.
     */
    async ccrvFetchResult(data: CCRVFetchResultRequest): Promise<CCRVFetchResultResponse> {
        return this.post('/ccrv/fetch-result', data);
    }

    /**
     * Search for CCRV records based on name and address.
     */
    async ccrvSearch(data: CCRVSearchRequest): Promise<CCRVSearchResponse> {
        return this.post('/ccrv/search', data);
    }

    // Public post method for generic use (inherited from BaseApi)
    public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return super.post<T>(url, data, config);
    }
}

export const vehicleApi = new VehicleApi('/api');
