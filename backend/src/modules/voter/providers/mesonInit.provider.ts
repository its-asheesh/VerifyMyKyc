import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { VoterMesonInitResponse } from '../../../common/types/voter';

export async function voterMesonInitProvider(): Promise<VoterMesonInitResponse> {
  try {
    const response = await apiClient.get('/voter-api/meson/init');
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Voter Meson init failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}
