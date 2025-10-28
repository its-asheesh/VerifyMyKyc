import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';

export async function fetchPassbookProvider(transactionId: string, payload: { member_id: string; office_id: string }) {
  return makeProviderApiCall({
    endpoint: '/epfo-api/passbook/fetch',
    payload,
    operationName: 'EPFO Fetch Passbook',
    headers: { 'X-Transaction-ID': transactionId },
    customErrorMapper: createStandardErrorMapper('Fetch passbook failed')
  });
}

