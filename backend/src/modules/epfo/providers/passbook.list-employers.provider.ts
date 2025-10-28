import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function listEmployersProvider(transactionId: string) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/passbook/employers',
    payload: {},
    operationName: 'EPFO List Employers',
    method: 'GET',
    headers: { 'X-Transaction-ID': transactionId },
    customErrorMapper: createStandardErrorMapper('List employers failed')
  });
}

