import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function employerVerifyProvider(payload: { employer_name: string; consent: string }) {
  try {
    const response = await apiClient.post('/epfo-api/employer-verify', payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Employer verify failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


