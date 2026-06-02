import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { HTTPError } from '../../../common/http/error';
import { CinByPanRequest, CinByPanResponse } from '../../../common/types/mca';

export async function fetchCinByPanProvider(payload: CinByPanRequest): Promise<CinByPanResponse> {
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

  return makeProviderApiCall<CinByPanResponse>({
    endpoint: '/mca-api/cin-by-pan',
    payload: externalPayload,
    operationName: 'MCA CIN by PAN',
    customErrorMapper: createStandardErrorMapper('Fetch CIN by PAN failed'),
  });
}
