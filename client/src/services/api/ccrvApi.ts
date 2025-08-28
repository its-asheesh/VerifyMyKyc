import BaseApi from './baseApi';
import type {
  CCRVGenerateReportRequest,
  CCRVGenerateReportResponse,
  CCRVFetchResultRequest,
  CCRVFetchResultResponse,
  CCRVSearchRequest,
  CCRVSearchResponse,
} from '../../types/kyc';

class CCRVApi extends BaseApi {
  /**
   * Generate a CCRV report for criminal case record verification.
   * This API initiates the CCRV verification process and returns a transaction ID.
   */
  async generateReport(data: CCRVGenerateReportRequest): Promise<CCRVGenerateReportResponse> {
    return this.post('/ccrv/generate-report', data);
  }

  /**
   * Fetch the CCRV result using the transaction ID.
   * This API is used to get the status of verification or the final result.
   */
  async fetchResult(data: CCRVFetchResultRequest): Promise<CCRVFetchResultResponse> {
    return this.post('/ccrv/fetch-result', data);
  }

  /**
   * Search for CCRV records based on name and address.
   * This API initiates a search for criminal case records.
   */
  async search(data: CCRVSearchRequest): Promise<CCRVSearchResponse> {
    return this.post('/ccrv/search', data);
  }

  // Public post method for generic use (inherited from BaseApi)
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config);
  }
}

export const ccrvApi = new CCRVApi('/api');