import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { CinByPanRequest, CinByPanResponse } from '../../../common/types/pan';

export async function fetchCinByPanProvider(payload: CinByPanRequest): Promise<CinByPanResponse> {
  try {
    // Accept either `pan` or `pan_number` from upstream layers and pass consent if provided
    const externalPayload: any = {
      pan: (payload as any).pan || (payload as any).pan_number,
      consent: (payload as any).consent, // optional, some providers may require it
    };

    // Mask PAN for logging (show only last 4)
    const maskedPan = externalPayload?.pan ? `******${externalPayload.pan.slice(-4)}` : undefined;
    console.log('CIN by PAN API Request:', {
      url: '/mca-api/cin-by-pan',
      pan: maskedPan,
      consent: externalPayload.consent,
      baseURL: process.env.GRIDLINES_BASE_URL
    });

    const response = await apiClient.post('/mca-api/cin-by-pan', externalPayload);

    console.log('CIN by PAN API Response:', {
      status: response.status,
      data: response.data
    });

    return response.data as CinByPanResponse;
  } catch (error: any) {
    console.error('CIN by PAN API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // Provide clearer error mapping
    let errorMessage = 'Fetch CIN by PAN failed';
    let statusCode = 500;

    if (error.code === 'ECONNABORTED' || (typeof error.message === 'string' && error.message.includes('timeout'))) {
      errorMessage = 'Request to Gridlines API timed out. Please try again.';
      statusCode = 408;
    } else if (error.response?.status === 401) {
      errorMessage = 'Invalid API key or authentication failed';
      statusCode = 401;
    } else if (error.response?.status === 404) {
      errorMessage = 'CIN API endpoint not found';
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.response?.status === 500) {
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
