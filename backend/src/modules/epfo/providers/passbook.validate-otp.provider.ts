import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function validateOtpProvider(transactionId: string, payload: { otp: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/passbook/validate-otp',
    payload,
    operationName: 'EPFO Validate OTP',
    headers: { 'X-Transaction-ID': transactionId },
    customErrorMapper: createStandardErrorMapper('Validate OTP failed')
  });
}

