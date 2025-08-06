import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { PanFatherNameRequest, PanFatherNameResponse } from '../../../common/types/pan';

// Expects payload: { pan_number: string, consent: string }
export async function fetchFatherNameByPanProvider(payload: PanFatherNameRequest): Promise<PanFatherNameResponse> {
  try {
    const response = await apiClient.post('/pan-api/fetch-father-name', payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('PAN API error:', error.response.data);
    } else {
      console.error('PAN API error:', error.message);
    }
    throw new HTTPError(
      error.response?.data?.message || 'Fetch Father Name by PAN failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
