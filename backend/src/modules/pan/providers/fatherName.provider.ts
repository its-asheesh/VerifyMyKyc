import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { PanFatherNameRequest, PanFatherNameResponse } from '../../../common/types/pan';

// Expects payload: { pan_number: string, consent: string }
export async function fetchFatherNameByPanProvider(payload: PanFatherNameRequest): Promise<PanFatherNameResponse> {
  try {
    // Debug: outbound request details
    console.log('PAN Father-Name API Request:', {
      url: '/pan-api/fetch-father-name',
      payload,
      baseURL: process.env.GRIDLINES_BASE_URL
    });
    
    const response = await apiClient.post('/pan-api/fetch-father-name', payload);
    
    // Debug: inbound response details
    console.log('PAN Father-Name API Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error: any) {
    // Structured error logging for faster diagnostics
    console.error('PAN Father-Name API Error:', {
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

    // Specific mapping to avoid generic 500s when the cause is known
    let errorMessage = 'Fetch Father Name by PAN failed';
    let statusCode = 500;

    if (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.includes('timeout'))) {
      errorMessage = 'Request to Gridlines API timed out. Please try again.';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.response?.status === 404) {
      errorMessage = 'PAN API endpoint not found';
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.response?.status === 500) {
      // External API 500 - distinguish upstream errors when available
      if (error.response?.data?.error?.code === 'UPSTREAM_INTERNAL_SERVER_ERROR') {
        errorMessage = 'Government source temporarily unavailable. Please try again in a few minutes.';
        statusCode = 503;
      } else {
        errorMessage = 'External API server error. Please try again.';
        statusCode = 502;
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status || 500;
    }
    throw new HTTPError(errorMessage, statusCode, error.response?.data);
  }
}
