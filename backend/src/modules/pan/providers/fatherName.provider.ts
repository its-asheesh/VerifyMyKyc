import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { PanFatherNameRequest, PanFatherNameResponse } from '../../../common/types/pan';

// Expects payload: { pan_number: string, consent: string }
export async function fetchFatherNameByPanProvider(
  payload: PanFatherNameRequest,
): Promise<PanFatherNameResponse> {
  return makeProviderApiCall<PanFatherNameResponse>({
    endpoint: '/pan-api/fetch-father-name',
    payload,
    operationName: 'PAN Father-Name',
    customErrorMapper: createStandardErrorMapper('Fetch Father Name by PAN failed'),
  });
}
