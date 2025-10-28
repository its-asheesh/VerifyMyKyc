import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { FetchCompanyRequest, FetchCompanyResponse } from '../../../common/types/mca';

export async function fetchCompanyProvider(payload: FetchCompanyRequest): Promise<FetchCompanyResponse> {
  return makeProviderApiCall<FetchCompanyResponse>({
    endpoint: '/mca-api/fetch-company',
    payload,
    operationName: 'MCA Fetch Company',
    customErrorMapper: createStandardErrorMapper('Fetch Company failed')
  });
}
