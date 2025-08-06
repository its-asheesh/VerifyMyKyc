import axios from 'axios';
import { HTTPError } from '../../../common/http/error';
import { PanDigilockerPullRequest, PanDigilockerPullResponse } from '../../../common/types/pan';

export async function digilockerPullPanProvider(
  payload: PanDigilockerPullRequest, 
  transactionId: string
): Promise<PanDigilockerPullResponse> {
  try {
    // Custom API client for Digilocker endpoints with transaction ID
    const digilockerApiClient = axios.create({
      baseURL: process.env.GRIDLINES_BASE_URL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY || '',
        'X-Auth-Type': 'API-Key',
        'X-Transaction-ID': transactionId, // Use the provided transaction ID
      },
    });

    console.log('Digilocker Pull PAN API Request:', {
      url: '/digilocker/pan/pull-document',
      payload,
      transactionId,
      baseURL: process.env.GRIDLINES_BASE_URL
    });
    
    const response = await digilockerApiClient.post('/digilocker/pan/pull-document', payload);
    
    console.log('Digilocker Pull PAN API Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Digilocker Pull PAN API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });
    
    // Handle specific DigiLocker authorization error
    if (error.response?.data?.error?.code === 'DIGILOCKER_AUTHORIZATION_NOT_COMPLETED') {
      throw new HTTPError(
        'DigiLocker authorization not completed. Please complete the OAuth flow first by visiting the authorization URL from the init API.',
        400,
        {
          error: {
            code: 'DIGILOCKER_AUTHORIZATION_NOT_COMPLETED',
            message: 'Please complete the DigiLocker authorization by visiting the authorization URL from the init API.',
            details: error.response?.data?.error
          }
        }
      );
    }
    
    throw new HTTPError(
      error.response?.data?.message || 'Digilocker Pull PAN failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
} 