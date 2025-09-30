import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function listEmployersProvider(transactionId: string) {
  try {
    const response = await apiClient.get('/epfo-api/passbook/employers', {
      headers: { 'X-Transaction-ID': transactionId },
    } as any);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'List employers failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


