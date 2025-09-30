import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function validateOtpProvider(transactionId: string, payload: { otp: string }) {
  try {
    const response = await apiClient.post('/epfo-api/passbook/validate-otp', payload, {
      headers: { 'X-Transaction-ID': transactionId },
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Validate OTP failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


