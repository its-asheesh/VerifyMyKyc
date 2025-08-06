import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import FormData from 'form-data';

export async function aadhaarOcrV2Provider(file_front: Buffer, file_front_name: string, consent: string, file_back?: Buffer, file_back_name?: string) {
  try {
    const form = new FormData();
    form.append('file_front', file_front, file_front_name);
    if (file_back && file_back_name) {
      form.append('file_back', file_back, file_back_name);
    }
    form.append('consent', consent);

    const response = await apiClient.post('/aadhaar-api/ocr/v2', form, {
      headers: form.getHeaders(),
      maxContentLength: 5 * 1024 * 1024, // 5MB
    });
    return response.data;
  } catch (error: any) {
    console.error('Aadhaar OCR V2 error details:', error.response?.data);
    throw new HTTPError(
      error.response?.data?.message || 'Aadhaar OCR V2 failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
