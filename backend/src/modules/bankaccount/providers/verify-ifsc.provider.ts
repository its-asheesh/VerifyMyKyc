import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { IfscValidateRequest, IfscValidateResponse } from '../../../common/types/bank';

export async function verifyIfscProvider(
  payload: IfscValidateRequest
): Promise<IfscValidateResponse> {
  return makeProviderApiCall<IfscValidateResponse>({
    endpoint: '/bank-api/verify-ifsc',
    payload,
    operationName: 'IFSC Validation',
    customErrorMapper: createStandardErrorMapper('IFSC validation failed')
  });
}

