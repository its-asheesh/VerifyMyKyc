import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { logger } from '../../../common/utils/logger';
import { AxiosResponse } from 'axios';

// Import CCRV API types - Make sure the path is correct
import {
  CCRVGenerateReportRequest,
  CCRVGenerateReportResponse,
  CCRVFetchResultRequest,
  CCRVFetchResultResponse,
  CCRVSearchRequest, // Added missing import
  CCRVSearchResponse, // Added missing import
} from '../../../common/types/ccrv';

/**
 * A generic helper to wrap API calls, handle responses, and standardize error handling.
 * @param requestPromise A promise returned by an apiClient call.
 * @param defaultErrorMessage A fallback error message.
 * @returns The data from the API response.
 */
async function handleProviderRequest<T>(
  requestPromise: Promise<AxiosResponse<T>>,
  defaultErrorMessage: string,
): Promise<T> {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || defaultErrorMessage,
      error.response?.status || 500,
      error.response?.data,
    );
  }
}

/**
 * Generates a CCRV report for criminal case record verification.
 * This API initiates the CCRV verification process and returns a transaction ID.
 */
export async function generateCCRVReportProvider(
  payload: CCRVGenerateReportRequest,
): Promise<CCRVGenerateReportResponse> {
  logger.info('CCRV Generate Report Provider: Using Search API instead of Generate Report API');
  logger.info('CCRV Generate Report Provider: Payload:', { payload });

  // Convert Generate Report payload to Search payload format
  const searchPayload = {
    name: payload.name,
    address: payload.address,
    father_name: payload.father_name || '',
    date_of_birth: payload.date_of_birth || '',
    case_category: 'CRIMINAL' as const,
    type: 'RESPONDENT' as const,
    name_match_type: 'PARTIAL_FUZZY' as const,
    father_match_type: 'PARTIAL_FUZZY' as const,
    jurisdiction_type: 'PAN_INDIA' as const,
    consent: payload.consent,
  };

  logger.info('CCRV Generate Report Provider: Converted to Search payload:', { searchPayload });

  // Use the Search API instead of Generate Report API
  const searchResponse = await handleProviderRequest(
    apiClient.post('/ccrv-api/rapid/search', searchPayload),
    'Failed to generate CCRV report using search API',
  );

  // Convert Search response to Generate Report response format
  return {
    request_id: searchResponse.request_id,
    transaction_id: searchResponse.transaction_id,
    status: searchResponse.status,
    data: {
      code: '1000' as const,
      message: 'CCRV request successful via search API',
      transaction_id: searchResponse.transaction_id,
      ccrv_status: searchResponse.data.ccrv_status as 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED',
    },
    timestamp: searchResponse.timestamp,
    path: '/ccrv-api/generate-report',
  };
}

/**
 * Fetches the CCRV result using the transaction ID.
 * This API is used to get the status of verification or the final result.
 */
export async function fetchCCRVResultProvider(
  payload: CCRVFetchResultRequest,
): Promise<CCRVFetchResultResponse> {
  return handleProviderRequest(
    apiClient.get('/ccrv-api/rapid/result', {
      headers: {
        'X-Transaction-ID': payload.transaction_id,
      },
    }),
    'Failed to fetch CCRV result',
  );
}

/**
 * Searches for CCRV records based on name and address.
 * This API initiates a search for criminal case records.
 */
export async function searchCCRVProvider(payload: CCRVSearchRequest): Promise<CCRVSearchResponse> {
  logger.info('CCRV Search Provider: sending payload to API:', { payload });
  // logger.info('CCRV Search Provider: API URL:', process.env.GRIDLINES_BASE_URL + '/ccrv-api/rapid/search');
  // logger.info('CCRV Search Provider: API Key set:', !!process.env.GRIDLINES_API_KEY);
  // logger.info('CCRV Search Provider: API Key value:', process.env.GRIDLINES_API_KEY ? 'SET' : 'NOT SET');

  // Ensure consent is properly formatted
  const formattedPayload = {
    ...payload,
    consent: payload.consent === 'Y' ? 'Y' : 'N',
  };

  logger.info('CCRV Search Provider: formatted payload:', { formattedPayload });

  // Use the correct endpoint from API documentation
  const endpoint = '/ccrv-api/rapid/search';

  logger.info(`CCRV Search Provider: using endpoint ${endpoint}`);

  return handleProviderRequest(
    apiClient.post(endpoint, formattedPayload, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY,
        'X-Auth-Type': 'API-Key',
        'X-Reference-ID': `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      },
    }),
    'CCRV search failed',
  );
}

// Export all CCRV provider functions
export default {
  generateCCRVReportProvider,
  fetchCCRVResultProvider,
  searchCCRVProvider,
};
