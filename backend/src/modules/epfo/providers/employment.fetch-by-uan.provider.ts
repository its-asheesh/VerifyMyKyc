import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function employmentByUanProvider(payload: { uan_number: string; consent: string }) {
  try {
    const response = await apiClient.post('/epfo-api/employment-history/fetch-by-uan', payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Fetch employment by UAN failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


