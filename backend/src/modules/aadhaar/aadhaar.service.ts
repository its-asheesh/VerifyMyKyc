import { aadhaarOcrV1Provider } from './providers/ocrV1.provider';
import { aadhaarOcrV2Provider } from './providers/ocrV2.provider';
import { fetchEAadhaarProvider } from './providers/fetchEAadhaar.provider';
import { FetchEAadhaarRequest } from '../../common/types/eaadhaar';

export class AadhaarService {
  // For base64 image OCR (V1)
  async ocrV1(base64_data: string, consent: string) {
    return aadhaarOcrV1Provider(base64_data, consent);
  }

  // For file upload OCR (V2)
  async ocrV2(file_front: Buffer, file_front_name: string, consent: string, file_back?: Buffer, file_back_name?: string) {
    return aadhaarOcrV2Provider(file_front, file_front_name, consent, file_back, file_back_name);
  }

  async fetchEAadhaar(payload: FetchEAadhaarRequest) {
    return fetchEAadhaarProvider(payload);
  }
}
