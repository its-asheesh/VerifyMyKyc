import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';
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
    console.error('Voter OCR Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    const { message, statusCode } = createStandardErrorMapper('Voter OCR failed')(error);
    throw new HTTPError(message, statusCode, error.response?.data);
  }
}
