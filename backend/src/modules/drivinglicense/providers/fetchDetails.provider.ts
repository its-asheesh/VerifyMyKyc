import { makeProviderApiCall, createStandardErrorMapper } from '../../../common/providers/BaseProvider';
import { DrivingLicenseFetchDetailsRequest, DrivingLicenseFetchDetailsResponse } from '../../../common/types/drivinglicense';

export async function fetchDrivingLicenseDetailsProvider(payload: DrivingLicenseFetchDetailsRequest): Promise<DrivingLicenseFetchDetailsResponse> {
  return makeProviderApiCall<DrivingLicenseFetchDetailsResponse>({
    endpoint: '/dl-api/fetch',
    payload,
    operationName: 'Driving License Fetch Details',
    customErrorMapper: createStandardErrorMapper('Fetch Driving License Details failed')
  });
} 