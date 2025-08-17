import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { VoterMesonFetchRequest, VoterMesonFetchResponse } from '../../../common/types/voter';

export async function voterMesonFetchProvider(payload: VoterMesonFetchRequest): Promise<VoterMesonFetchResponse> {
  try {
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

    const response = await apiClient.post('/voter-api/meson/fetch', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch Voter details (Meson) failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
