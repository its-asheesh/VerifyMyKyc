import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function fetchPassbookProvider(transactionId: string, payload: { member_id: string; office_id: string }) {
  try {
    const response = await apiClient.post('/epfo-api/passbook/fetch', payload, {
      headers: { 'X-Transaction-ID': transactionId },
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Fetch passbook failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


