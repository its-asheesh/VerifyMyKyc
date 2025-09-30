import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

export async function fetchUanProvider(payload: { mobile_number: string; pan?: string; consent: string }) {
  try {
    const externalPayload = {
      mobile_number: payload.mobile_number,
      pan: payload.pan,
      consent: payload.consent,
    };
    const response = await apiClient.post('/epfo-api/fetch-uan', externalPayload);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Fetch UAN failed';
    const status = error?.response?.status || 500;
    throw new HTTPError(message, status, error?.response?.data);
  }
}


