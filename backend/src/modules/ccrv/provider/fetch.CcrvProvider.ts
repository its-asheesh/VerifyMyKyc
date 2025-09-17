import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { AxiosResponse } from 'axios';

// Import CCRV API types - Make sure the path is correct
import {
  CCRVGenerateReportRequest,
  CCRVGenerateReportResponse,
  CCRVFetchResultRequest,
  CCRVFetchResultResponse,
  CCRVSearchRequest,      // Added missing import
  CCRVSearchResponse      // Added missing import
} from '../../../common/types/ccrv';

/**
 * A generic helper to wrap API calls, handle responses, and standardize error handling.
 * @param requestPromise A promise returned by an apiClient call.
 * @param defaultErrorMessage A fallback error message.
 * @returns The data from the API response.
 */
async function handleProviderRequest<T>(
  requestPromise: Promise<AxiosResponse<T>>,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || defaultErrorMessage,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Generates a CCRV report for criminal case record verification.
 * This API initiates the CCRV verification process and returns a transaction ID.
 */
export async function generateCCRVReportProvider(
  payload: CCRVGenerateReportRequest
): Promise<CCRVGenerateReportResponse> {
  return handleProviderRequest(
    apiClient.post('/ccrv-api/rapid/generate-report', payload),
    'Failed to generate CCRV report'
  );
}

/**
 * Fetches the CCRV result using the transaction ID.
 * This API is used to get the status of verification or the final result.
 */
export async function fetchCCRVResultProvider(
  payload: CCRVFetchResultRequest
): Promise<CCRVFetchResultResponse> {
  return handleProviderRequest(
    apiClient.get('/ccrv-api/rapid/result', {
      headers: {
        'X-Transaction-ID': payload.transaction_id
      }
    }),
    'Failed to fetch CCRV result'
  );
}

/**
 * Searches for CCRV records based on name and address.
 * This API initiates a search for criminal case records.
 */
export async function searchCCRVProvider(
  payload: CCRVSearchRequest
): Promise<CCRVSearchResponse> {
  console.log('CCRV Search Provider: sending payload to API:', JSON.stringify(payload, null, 2));
  console.log('CCRV Search Provider: API URL:', process.env.GRIDLINES_BASE_URL + '/ccrv-api/rapid/search');
  console.log('CCRV Search Provider: API Key set:', !!process.env.GRIDLINES_API_KEY);
  console.log('CCRV Search Provider: API Key value:', process.env.GRIDLINES_API_KEY ? 'SET' : 'NOT SET');
  
  // Ensure consent is properly formatted
  const formattedPayload = {
    ...payload,
    consent: payload.consent === 'Y' ? 'Y' : 'N'
  };
  
  console.log('CCRV Search Provider: formatted payload:', JSON.stringify(formattedPayload, null, 2));
  
  // Use the correct endpoint from API documentation
  const endpoint = '/ccrv-api/rapid/search';
  
  console.log(`CCRV Search Provider: using endpoint ${endpoint}`);
  
  return handleProviderRequest(
    apiClient.post(endpoint, formattedPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY,
        'X-Auth-Type': 'API-Key',
        'X-Reference-ID': `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      }
    }),
    'CCRV search failed'
  );
}

// Export all CCRV provider functions
export default {
  generateCCRVReportProvider,
  fetchCCRVResultProvider,
  searchCCRVProvider,
};