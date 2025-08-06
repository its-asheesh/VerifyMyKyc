import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { PanAadhaarLinkRequest, PanAadhaarLinkResponse } from '../../../common/types/pan';

export async function checkPanAadhaarLinkProvider(payload: PanAadhaarLinkRequest): Promise<PanAadhaarLinkResponse> {
  try {
    console.log('PAN-Aadhaar Link API Request:', {
      url: '/pan-api/check-aadhaar-link',
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL
    });
    
    const response = await apiClient.post('/pan-api/check-aadhaar-link', payload);
    
    console.log('PAN-Aadhaar Link API Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    console.error('PAN-Aadhaar Link API Error:', {
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
      error.response?.data?.message || 'Check PAN-Aadhaar Link failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
