import { 
  generateCCRVReportProvider,
  fetchCCRVResultProvider,
  searchCCRVProvider
} from './provider/fetch.CcrvProvider';

// Import request types
import {
  CCRVGenerateReportRequest,
  CCRVFetchResultRequest,
  CCRVSearchRequest,
} from '../../common/types/ccrv';

// Import response types
import {
  CCRVGenerateReportResponse,
  CCRVFetchResultResponse,
  CCRVSearchResponse,
} from '../../common/types/ccrv';

export class CCRVService {
  /**
   * Generates a CCRV report for criminal case record verification.
   * This API initiates the CCRV verification process and returns a transaction ID.
   */
  async generateReport(payload: CCRVGenerateReportRequest): Promise<CCRVGenerateReportResponse> {
    return generateCCRVReportProvider(payload);
  }

  /**
   * Fetches the CCRV result using the transaction ID.
   * This API is used to get the status of verification or the final result.
   */
  async fetchResult(payload: CCRVFetchResultRequest): Promise<CCRVFetchResultResponse> {
    return fetchCCRVResultProvider(payload);
  }

  /**
   * Searches for CCRV records based on name and address.
   * This API initiates a search for criminal case records.
   */
  async search(payload: CCRVSearchRequest): Promise<CCRVSearchResponse> {
    return searchCCRVProvider(payload);
  }
}