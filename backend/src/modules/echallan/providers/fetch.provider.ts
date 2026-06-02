import {
  makeProviderApiCall,
  createStandardErrorMapper,
} from '../../../common/providers/BaseProvider';
import { EChallanFetchRequest, EChallanFetchResponse } from '../../../common/types/echallan';

export async function fetchEChallanProvider(
  payload: EChallanFetchRequest,
): Promise<EChallanFetchResponse> {
  return makeProviderApiCall<EChallanFetchResponse>({
    endpoint: '/rc-api/echallan/fetch',
    payload,
    operationName: 'E-Challan Fetch',
    customErrorMapper: createStandardErrorMapper('Fetch E-Challan failed'),
  });
}
