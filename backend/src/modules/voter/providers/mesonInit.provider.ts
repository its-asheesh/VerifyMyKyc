import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { VoterMesonInitResponse } from '../../../common/types/voter';

export async function voterMesonInitProvider(): Promise<VoterMesonInitResponse> {
  return makeProviderApiCall<VoterMesonInitResponse>({
    endpoint: '/voter-api/meson/init',
    payload: {},
    operationName: 'Voter Meson Init',
    method: 'GET',
    customErrorMapper: createStandardErrorMapper('Voter Meson init failed')
  });
}
