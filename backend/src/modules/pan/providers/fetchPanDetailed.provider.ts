import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { FetchPanDetailsRequest, FetchPanDetailResponse } from '../../../common/types/pan';

export async function fetchPanDetailedProvider(
  payload: FetchPanDetailsRequest,
): Promise<FetchPanDetailResponse> {
  return makeProviderApiCall<FetchPanDetailResponse>({
    endpoint: '/pan-api/fetch-detailed',
    payload,
    operationName: 'PAN Detailed',
    customErrorMapper: createStandardErrorMapper('Fetch PAN Detailed failed'),
  });
}
