import { drivingLicenseOcrProvider } from './providers/ocr.provider';
import { fetchDrivingLicenseDetailsProvider } from './providers/fetchDetails.provider';
import {
  DrivingLicenseOcrRequest,
  DrivingLicenseFetchDetailsRequest,
} from '../../common/types/drivinglicense';

export class DrivingLicenseService {
  async ocr(
    file_front: Buffer,
    file_front_name: string,
    consent: string,
    file_back?: Buffer,
    file_back_name?: string,
  ) {
    return drivingLicenseOcrProvider(
      file_front,
      file_front_name,
      consent,
      file_back,
      file_back_name,
    );
  }

  async fetchDetails(payload: DrivingLicenseFetchDetailsRequest) {
    return fetchDrivingLicenseDetailsProvider(payload);
  }
}
