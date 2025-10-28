import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { DigilockerIssuedFileRequest, DigilockerIssuedFileResponse } from '../../../common/types/pan';

const digilockerApiClient = axios.create({
  baseURL: process.env.GRIDLINES_BASE_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': process.env.GRIDLINES_API_KEY || '',
    'X-Auth-Type': 'API-Key',
  },
});

export async function digilockerIssuedFileProvider(
  payload: DigilockerIssuedFileRequest
): Promise<DigilockerIssuedFileResponse> {
  try {
    const headers: any = {
      'X-Transaction-ID': payload.transaction_id,
    };
    if (payload.reference_id) {
      headers['X-Reference-ID'] = payload.reference_id;
    }
    const response = await digilockerApiClient.post('/digilocker/issued-file', {
      file_uri: payload.file_uri,
      format: payload.format,
    }, { headers });
    return response.data;
  } catch (error: any) {
    console.error('Digilocker Issued File Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    const { message, statusCode } = createStandardErrorMapper('Digilocker Issued File fetch failed')(error);
    throw new HTTPError(message, statusCode, error.response?.data);
  }
} 