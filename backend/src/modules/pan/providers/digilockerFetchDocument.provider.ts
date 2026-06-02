import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export interface DigilockerFetchDocumentRequest {
  document_uri: string;
  transaction_id: string;
}

export interface DigilockerFetchDocumentResponse {
  request_id: string;
  transaction_id: string;
  status: number;
  data: {
    code: string;
    message: string;
    document_content?: any;
    document_url?: string;
  };
  timestamp: number;
  path: string;
}

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

export async function digilockerFetchDocumentProvider(
  payload: DigilockerFetchDocumentRequest,
): Promise<DigilockerFetchDocumentResponse> {
  try {
    console.log('Digilocker Fetch Document API Request:', {
      url: `/digilocker/document/${payload.document_uri}`,
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL,
    });

    const response = await digilockerApiClient.get(`/digilocker/document/${payload.document_uri}`, {
      headers: {
        'X-Transaction-ID': payload.transaction_id,
      },
    });

    console.log('Digilocker Fetch Document API Response:', {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    console.error('Digilocker Fetch Document API Error:', {
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

    const { message, statusCode } = createStandardErrorMapper('Digilocker Fetch Document failed')(
      error,
    );
    throw new HTTPError(message, statusCode, error.response?.data);
  }
}
