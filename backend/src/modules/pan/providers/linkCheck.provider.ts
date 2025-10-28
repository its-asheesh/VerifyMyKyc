import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { PanAadhaarLinkRequest, PanAadhaarLinkResponse } from '../../../common/types/pan';

export async function checkPanAadhaarLinkProvider(payload: PanAadhaarLinkRequest): Promise<PanAadhaarLinkResponse> {
  return makeProviderApiCall<PanAadhaarLinkResponse>({
    endpoint: '/pan-api/check-aadhaar-link',
    payload,
    operationName: 'PAN-Aadhaar Link',
    customErrorMapper: createStandardErrorMapper('Check PAN-Aadhaar Link failed')
  });
}
