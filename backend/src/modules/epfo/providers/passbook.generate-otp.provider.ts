import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function generateOtpProvider(payload: { uan: string; consent: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/passbook/generate-otp',
    payload,
    operationName: 'EPFO Generate OTP',
    customErrorMapper: createStandardErrorMapper('Generate OTP failed')
  });
}

