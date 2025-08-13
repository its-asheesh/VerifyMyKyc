import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { CinByPanRequest, CinByPanResponse } from '../../../common/types/pan';

export async function fetchCinByPanProvider(payload: CinByPanRequest): Promise<CinByPanResponse> {
  try {
    console.log('CIN by PAN API Request:', {
      url: '/mca-api/cin-by-pan',
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL
    });
    
    const response = await apiClient.post('/mca-api/cin-by-pan', payload);
    
    console.log('CIN by PAN API Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data as CinByPanResponse;
  } catch (error: any) {
    console.error('CIN by PAN API Error:', {
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
    
    throw new HTTPError(
      error.response?.data?.message || 'Fetch CIN by PAN failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
