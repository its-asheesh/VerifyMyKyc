import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

// Import all RC types (ensure this path is correct based on your project structure)
import {
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
} from '../../../common/types/vehicle';

/**
 * Fetches basic RC (Registration Certificate) details.
 */
export async function fetchRcLiteDetailsProvider(
  payload: RcFetchLiteRequest
): Promise<RcFetchLiteResponse> {
  try {
    const response = await apiClient.post('/rc-api/fetch-lite', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch RC Lite Details failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Fetches detailed RC registration information.
 */
export async function fetchRcDetailedProvider(
  payload: RcFetchDetailedRequest
): Promise<RcFetchDetailedResponse> {
  try {
    const response = await apiClient.post('/rc-api/fetch-detailed', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch RC Detailed Details failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Fetches detailed RC information along with linked challans.
 */
export async function fetchRcDetailedWithChallanProvider(
  payload: RcFetchDetailedChallanRequest
): Promise<RcFetchDetailedChallanResponse> {
  try {
    const response = await apiClient.post('/rc-api/fetch-detailed-challan', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch RC Detailed With Challan failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Fetches e-challan details using RC, chassis, and engine number.
 */
export async function fetchEChallanProvider(
  payload: RcEchallanFetchRequest
): Promise<RcEchallanFetchResponse> {
  try {
    const response = await apiClient.post('/rc-api/echallan/fetch', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch E-Challan failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Fetches vehicle registration number using chassis number.
 */
export async function fetchRegNumByChassisProvider(
  payload: RcFetchRegNumByChassisRequest
): Promise<RcFetchRegNumByChassisResponse> {
  try {
    const response = await apiClient.post('/rc-api/fetch-reg-num-by-chassis', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch Registration Number by Chassis failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Fetches FASTag details using RC number or Tag ID.
 */
export async function fetchFastagDetailsProvider(
  payload: RcFastagFetchRequest
): Promise<RcFastagFetchResponse> {
  try {
    const response = await apiClient.post('/rc-api/fastag/fetch-detailed', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch FASTag Details failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

// Export all provider functions
export default {
  fetchRcLiteDetailsProvider,
  fetchRcDetailedProvider,
  fetchRcDetailedWithChallanProvider,
  fetchEChallanProvider,
  fetchRegNumByChassisProvider,
  fetchFastagDetailsProvider,
};