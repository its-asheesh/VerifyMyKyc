import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { BankAccountVerifyRequest, BankAccountVerifyResponse } from '../../../common/types/bank';

export async function verifyBankAccountProvider(
  payload: BankAccountVerifyRequest
): Promise<BankAccountVerifyResponse> {
  try {
    // External API path as per docs
    const response = await apiClient.post('/bank-api/verify', payload);
    return response.data as BankAccountVerifyResponse;
  } catch (error: any) {
    throw new HTTPError(
      error?.response?.data?.message || 'Bank account verification failed',
      error?.response?.status || 500,
      error?.response?.data
    );
  }
}


