import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
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
    throw new HTTPError(
      error.response?.data?.message || 'Digilocker Issued Files fetch failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
} 