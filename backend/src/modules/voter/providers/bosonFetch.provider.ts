import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { HTTPError } from '../../../common/http/error';
import { VoterBosonFetchRequest, VoterBosonFetchResponse } from '../../../common/types/voter';

export async function voterBosonFetchProvider(
  payload: VoterBosonFetchRequest,
): Promise<VoterBosonFetchResponse> {
  // Validation
  if (payload.consent !== 'Y') {
    throw new HTTPError('Consent is required to fetch Voter details', 400);
  }

  const voterIdRegex = /^[A-Z0-9]{10}$/i;
  if (!voterIdRegex.test(payload.voter_id)) {
    throw new HTTPError('Invalid Voter ID format', 400);
  }

  return makeProviderApiCall<VoterBosonFetchResponse>({
    endpoint: '/voter-api/boson/fetch',
    payload,
    operationName: 'Voter Boson Fetch',
    customErrorMapper: createStandardErrorMapper('Fetch Voter details (Boson) failed'),
  });
}
