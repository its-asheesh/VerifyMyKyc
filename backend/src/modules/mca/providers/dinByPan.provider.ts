import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { DinByPanRequest, DinByPanResponse } from '../../../common/types/pan';

export async function fetchDinByPanProvider(payload: DinByPanRequest): Promise<DinByPanResponse> {
  try {
    console.log('DIN by PAN API Request:', {
      url: '/mca-api/fetch-din-by-pan',
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL
    });
    
    const response = await apiClient.post('/mca-api/fetch-din-by-pan', payload);
    
    console.log('DIN by PAN API Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error('DIN by PAN API Error:', {
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
    
    // Provide more specific error messages
    let errorMessage = 'Fetch DIN by PAN failed';
    let statusCode = 500;
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = 'Request to Gridlines API timed out. Please try again.';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.response?.status === 404) {
      errorMessage = 'DIN API endpoint not found';
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status || 500;
    }
    
    throw new HTTPError(errorMessage, statusCode, error.response?.data);
  }
}
