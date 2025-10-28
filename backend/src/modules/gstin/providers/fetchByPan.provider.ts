import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { GstinByPanRequest, GstinByPanResponse } from '../../../common/types/pan';

export async function fetchGstinByPanProvider(payload: GstinByPanRequest): Promise<GstinByPanResponse> {
  // Transform payload to match external API format
  const externalPayload = {
    pan_number: payload.pan_number,
    consent: payload.consent
  };

  return makeProviderApiCall<GstinByPanResponse>({
    endpoint: '/gstin-api/fetch-by-pan',
    payload: externalPayload,
    operationName: 'GSTIN by PAN',
    customErrorMapper: createStandardErrorMapper('Fetch GSTIN by PAN failed')
  });
} 