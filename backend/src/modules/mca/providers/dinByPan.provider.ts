import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { DinByPanRequest, DinByPanResponse } from '../../../common/types/pan';

export async function fetchDinByPanProvider(payload: DinByPanRequest): Promise<DinByPanResponse> {
  // Transform payload to match external API format
  const externalPayload = {
    pan: payload.pan_number,
    consent: payload.consent,
  };

  return makeProviderApiCall<DinByPanResponse>({
    endpoint: '/mca-api/fetch-din-by-pan',
    payload: externalPayload,
    operationName: 'MCA DIN by PAN',
    customErrorMapper: createStandardErrorMapper('Fetch DIN by PAN failed'),
  });
}
