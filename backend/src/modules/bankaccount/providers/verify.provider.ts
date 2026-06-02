import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { BankAccountVerifyRequest, BankAccountVerifyResponse } from '../../../common/types/bank';

export async function verifyBankAccountProvider(
  payload: BankAccountVerifyRequest,
): Promise<BankAccountVerifyResponse> {
  return makeProviderApiCall<BankAccountVerifyResponse>({
    endpoint: '/bank-api/verify',
    payload,
    operationName: 'Bank Account Verification',
    customErrorMapper: createStandardErrorMapper('Bank account verification failed'),
  });
}
