import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { HTTPError } from '../../../common/http/error';
import { VoterMesonFetchRequest, VoterMesonFetchResponse } from '../../../common/types/voter';

export async function voterMesonFetchProvider(payload: VoterMesonFetchRequest): Promise<VoterMesonFetchResponse> {
  // Validation
  if (payload.consent !== 'Y') {
    throw new HTTPError('Consent is required to fetch Voter details', 400);
  }
  const voterIdRegex = /^[A-Z0-9]{10}$/i;
  if (!voterIdRegex.test(payload.voter_id)) {
    throw new HTTPError('Invalid Voter ID format', 400);
  }
  if (!payload.transaction_id) {
    throw new HTTPError('transaction_id is required for Meson fetch', 400);
  }

  return makeProviderApiCall<VoterMesonFetchResponse>({
    endpoint: '/voter-api/meson/fetch',
    payload,
    operationName: 'Voter Meson Fetch',
    customErrorMapper: createStandardErrorMapper('Fetch Voter details (Meson) failed')
  });
}
