import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { DrivingLicenseFetchDetailsRequest, DrivingLicenseFetchDetailsResponse } from '../../../common/types/drivinglicense';

export async function fetchDrivingLicenseDetailsProvider(payload: DrivingLicenseFetchDetailsRequest): Promise<DrivingLicenseFetchDetailsResponse> {
  try {
    const response = await apiClient.post('/dl-api/fetch', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Fetch Driving License Details failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
} 