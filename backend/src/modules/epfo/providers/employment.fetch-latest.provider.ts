import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function employmentLatestProvider(payload: { uan: string; consent: string }) {
  try {
    const response = await apiClient.post('/epfo-api/employment-history/fetch-latest', payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Fetch latest employment failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


