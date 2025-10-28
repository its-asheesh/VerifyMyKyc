import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function employmentByUanProvider(payload: { uan_number: string; consent: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/employment-history/fetch-by-uan',
    payload,
    operationName: 'EPFO Employment by UAN',
    customErrorMapper: createStandardErrorMapper('Fetch employment by UAN failed')
  });
}

