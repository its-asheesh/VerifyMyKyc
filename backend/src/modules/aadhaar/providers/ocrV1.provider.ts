import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function aadhaarOcrV1Provider(base64_data: string, consent: string) {
  try {
    const response = await apiClient.post('/aadhaar-api/ocr', {
      base64_data,
      consent,
    });
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Aadhaar OCR V1 failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
