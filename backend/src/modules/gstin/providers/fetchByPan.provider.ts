import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { GstinByPanRequest, GstinByPanResponse } from '../../../common/types/pan';

export async function fetchGstinByPanProvider(payload: GstinByPanRequest): Promise<GstinByPanResponse> {
  try {
    // Transform payload to match external API format
    const externalPayload = {
      pan_number: payload.pan_number,
      consent: payload.consent
    };

    console.log('GSTIN by PAN API Request:', {
      url: '/gstin-api/fetch-by-pan',
      payload: externalPayload,
      baseURL: process.env.GRIDLINES_BASE_URL
    });
    
    const response = await apiClient.post('/gstin-api/fetch-by-pan', externalPayload);
    
    console.log('GSTIN by PAN API Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data as GstinByPanResponse;
  } catch (error: any) {
    console.error('GSTIN by PAN API Error:', {
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
    let errorMessage = 'Fetch GSTIN by PAN failed';
    let statusCode = 500;
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      errorMessage = 'Request to Gridlines API timed out. Please try again.';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.response?.status === 404) {
      errorMessage = 'GSTIN API endpoint not found';
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.response?.status === 500) {
      // Handle external API 500 errors (government source issues)
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