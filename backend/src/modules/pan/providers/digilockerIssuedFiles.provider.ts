import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { DigilockerIssuedFilesRequest, DigilockerIssuedFilesResponse } from '../../../common/types/pan';

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

export async function digilockerIssuedFilesProvider(
  payload: DigilockerIssuedFilesRequest
): Promise<DigilockerIssuedFilesResponse> {
  try {
    const headers: any = {
      'X-Transaction-ID': payload.transaction_id,
    };
    if (payload.reference_id) {
      headers['X-Reference-ID'] = payload.reference_id;
    }
    const response = await digilockerApiClient.get('/digilocker/issued-files', {
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error('Digilocker Issued Files Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    const { message, statusCode } = createStandardErrorMapper('Digilocker Issued Files fetch failed')(error);
    throw new HTTPError(message, statusCode, error.response?.data);
  }
} 