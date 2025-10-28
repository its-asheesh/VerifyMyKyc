import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { FetchEAadhaarRequest, FetchEAadhaarResponse } from '../../../common/types/eaadhaar';

export async function fetchEAadhaarProvider(payload: FetchEAadhaarRequest): Promise<FetchEAadhaarResponse> {
  const params = payload.json !== undefined ? { json: payload.json } : {};
  
  return makeProviderApiCall<FetchEAadhaarResponse>({
    endpoint: '/digilocker/eaadhaar',
    payload: params,
    operationName: 'Fetch E-Aadhaar',
    method: 'GET',
    headers: {
      'X-Transaction-ID': payload.transaction_id,
    },
    customErrorMapper: createStandardErrorMapper('Fetch E-Aadhaar failed')
  });
} 