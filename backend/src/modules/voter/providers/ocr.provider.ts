import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import FormData from 'form-data';

export async function voterOcrProvider(
  file_front: Buffer,
  file_front_name: string,
  consent: string,
  file_back?: Buffer,
  file_back_name?: string
) {
  try {
    const form = new FormData();
    form.append('file_front', file_front, file_front_name);
    if (file_back && file_back_name) {
      form.append('file_back', file_back, file_back_name);
    }
    form.append('consent', consent);

    const response = await apiClient.post('/voter-api/ocr', form, {
      headers: form.getHeaders(),
      maxContentLength: 5 * 1024 * 1024, // 5MB
    });
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Voter OCR failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
