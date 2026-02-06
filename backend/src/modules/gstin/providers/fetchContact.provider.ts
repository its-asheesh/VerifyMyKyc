import apiClient from '../../../common/http/apiClient';
import { logger } from '../../../common/utils/logger';
import { HTTPError } from '../../../common/http/error';
import { createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { GstinContactRequest, GstinContactResponse } from '../../../common/types/pan';

export async function fetchGstinContactProvider(
  payload: GstinContactRequest,
): Promise<GstinContactResponse> {
  try {
    // Transform payload to match external API format
    const externalPayload = {
      gstin: payload.gstin,
      consent: payload.consent,
    };

    const requestUrl = `${process.env.GRIDLINES_BASE_URL}/gstin-api/fetch-contact-details`;
    logger.info('GSTIN Contact API Request:', {
      method: 'POST',
      url: requestUrl,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.GRIDLINES_API_KEY ? '***' : 'MISSING',
        'X-Auth-Type': 'API-Key',
      },
      data: externalPayload,
    });

    const startTime = Date.now();
    let response;
    try {
      response = await apiClient.post('/gstin-api/fetch-contact-details', externalPayload, {
        timeout: 30000,
        headers: {
          'X-Reference-ID': `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        },
      });

      logger.info(`GSTIN Contact API Response (${Date.now() - startTime}ms):`, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });

      if (response.data && response.data.status === 200 && response.data.data) {
        if (response.data.data.code === '1013') {
          return {
            email: response.data.data.gstin_data?.email || '',
            mobile: response.data.data.gstin_data?.mobile || '',
          } as GstinContactResponse;
        } else {
          throw new HTTPError(
            response.data.data.message || 'Failed to fetch GSTIN contact details',
            response.status,
            { code: response.data.data.code },
          );
        }
      } else {
        throw new HTTPError('Invalid response format from GSTIN contact details API', 500);
      }
    } catch (error: any) {
      logger.error('GSTIN Contact API Error:', {
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

      // Use standard error mapper with slight customization for 400 errors
      let errorMessage = 'Fetch GSTIN Contact Details failed';
      let statusCode = 500;

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request to Gridlines API timed out. Please try again.';
        statusCode = 408;
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request parameters';
        statusCode = 400;
      } else {
        // Use standard error mapper for other cases
        const mapperResult = createStandardErrorMapper(errorMessage)(error);
        errorMessage = mapperResult.message;
        statusCode = mapperResult.statusCode;
      }

      throw new HTTPError(errorMessage, statusCode, {
        code: error.code,
        response: error.response?.data,
        request: {
          method: error.config?.method,
          url: error.config?.url,
          data: error.config?.data,
        },
      });
    }
  } catch (error) {
    logger.error('Unexpected error in fetchGstinContactProvider:', error);
    throw new HTTPError('An unexpected error occurred while processing your request', 500);
  }
}
