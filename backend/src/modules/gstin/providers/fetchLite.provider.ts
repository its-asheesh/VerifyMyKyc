import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { HTTPError } from '../../../common/http/error';
import { FetchGstinLiteRequest, FetchGstinLiteResponse } from '../../../common/types/gst';

export async function fetchGstinLiteProvider(
  payload: FetchGstinLiteRequest,
): Promise<FetchGstinLiteResponse> {
  // Validation
  if (payload.consent !== 'Y') {
    throw new HTTPError('Consent is required to fetch GSTIN details', 400);
  }

  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  if (!gstinRegex.test(payload.gstin)) {
    throw new HTTPError('Invalid GSTIN format', 400);
  }

  const requestBody = {
    gstin: payload.gstin,
    consent: payload.consent,
    include_hsn_data: payload.include_hsn_data || false,
    include_filing_data: payload.include_filing_data || false,
    include_filing_frequency: payload.include_filing_frequency || false,
  };

  return makeProviderApiCall<FetchGstinLiteResponse>({
    endpoint: 'gstin-api/fetch-lite',
    payload: requestBody,
    operationName: 'GSTIN Fetch Lite',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.GRIDLINES_API_KEY || '',
      'X-Auth-Type': 'API-Key',
    },
    customErrorMapper: createStandardErrorMapper('Fetch GSTIN Lite failed'),
  });
}
