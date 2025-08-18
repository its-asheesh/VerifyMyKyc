import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { CinByPanRequest, CinByPanResponse } from '../../../common/types/mca';

export async function fetchCinByPanProvider(payload: CinByPanRequest): Promise<CinByPanResponse> {
  try {
    // Validate required inputs as per MCA docs: pan_number and consent are required
    if (!payload?.pan_number) {
      throw new HTTPError('pan_number is required', 400);
    }
    if (!payload?.consent) {
      throw new HTTPError('consent is required', 400);
    }

    const externalPayload: any = {
      pan_number: payload.pan_number,
      consent: payload.consent,
      // Some providers require human-readable consent text
      //consent_text: payload.consent_text || 'User consented to fetch CIN by PAN for verification.',
    };

    // Mask PAN for logging (show only last 4)
    const maskedPan = externalPayload?.pan_number ? `******${externalPayload.pan_number.slice(-4)}` : undefined;
    console.log('CIN by PAN API Request:', {
      url: '/mca-api/cin-by-pan',
      pan_number: maskedPan,
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
    } else if (error.response?.status === 400) {
      // Bubble up provider's reason when available
      const providerMsg = error.response?.data?.error?.message || error.response?.data?.message;
      const providerType = error.response?.data?.error?.type;
      if (providerMsg) errorMessage = providerMsg;
      // If docs link includes a clearer snippet (e.g., "Consent not provided"), include it
      if (!providerMsg && typeof providerType === 'string') {
        const note = providerType.split('Consent not provided').length > 1 ? 'Consent not provided.' : undefined;
        if (note) errorMessage = note;
      }
      statusCode = 400;
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
