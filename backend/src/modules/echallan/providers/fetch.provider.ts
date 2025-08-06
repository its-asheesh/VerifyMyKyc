import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { EChallanFetchRequest, EChallanFetchResponse } from '../../../common/types/echallan';

export async function fetchEChallanProvider(payload: EChallanFetchRequest): Promise<EChallanFetchResponse> {
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