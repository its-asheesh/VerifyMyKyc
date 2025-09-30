import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function generateOtpProvider(payload: { uan: string; consent: string }) {
  try {
    const response = await apiClient.post('/epfo-api/passbook/generate-otp', payload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Generate OTP failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


