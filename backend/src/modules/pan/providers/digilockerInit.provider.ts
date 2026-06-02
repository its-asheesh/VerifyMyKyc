import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { DigilockerInitRequest, DigilockerInitResponse } from '../../../common/types/pan';

// Custom API client for Digilocker endpoints
const digilockerApiClient = axios.create({
  baseURL: process.env.GRIDLINES_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': process.env.GRIDLINES_API_KEY || '',
    'X-Auth-Type': 'API-Key',
  },
});

export async function digilockerInitProvider(
  payload: DigilockerInitRequest,
): Promise<DigilockerInitResponse> {
  try {
    console.log('Digilocker Init API Request:', {
      url: '/digilocker/init',
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL,
    });

    const response = await digilockerApiClient.post('/digilocker/init', payload);

    console.log('Digilocker Init API Response:', {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    console.error('Digilocker Init API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
    });

    const { message, statusCode } = createStandardErrorMapper('Digilocker Init failed')(error);
    throw new HTTPError(message, statusCode, error.response?.data);
  }
}
