import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function employerVerifyProvider(payload: { employer_name: string; consent: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/employer-verify',
    payload,
    operationName: 'EPFO Employer Verify',
    customErrorMapper: createStandardErrorMapper('Employer verify failed')
  });
}

