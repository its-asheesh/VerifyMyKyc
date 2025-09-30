import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function uanByPanProvider(payload: { pan_number: string; consent: string }) {
  try {
    const response = await apiClient.post('/epfo-api/uan/fetch-by-pan', payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Fetch UAN by PAN failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


