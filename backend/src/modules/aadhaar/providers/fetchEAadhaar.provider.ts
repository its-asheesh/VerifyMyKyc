import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { FetchEAadhaarRequest, FetchEAadhaarResponse } from '../../../common/types/eaadhaar';

export async function fetchEAadhaarProvider(payload: FetchEAadhaarRequest): Promise<FetchEAadhaarResponse> {
  try {
    const params = payload.json !== undefined ? { json: payload.json } : {};
    const response = await apiClient.get('/digilocker/eaadhaar', {
      headers: {
        'X-Transaction-ID': payload.transaction_id,
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch E-Aadhaar failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
} 