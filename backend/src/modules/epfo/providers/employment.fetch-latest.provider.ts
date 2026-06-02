import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';

export async function employmentLatestProvider(payload: { uan: string; consent: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/employment-history/fetch-latest',
    payload,
    operationName: 'EPFO Latest Employment',
    customErrorMapper: createStandardErrorMapper('Fetch latest employment failed'),
  });
}
