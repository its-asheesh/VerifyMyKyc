import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { UpiVerifyRequest, UpiVerifyResponse } from '../../../common/types/bank';

export async function verifyUpiProvider(payload: UpiVerifyRequest): Promise<UpiVerifyResponse> {
  return makeProviderApiCall<UpiVerifyResponse>({
    endpoint: '/bank-api/verify-upi',
    payload,
    operationName: 'UPI Verification',
    customErrorMapper: createStandardErrorMapper('UPI verification failed'),
  });
}
