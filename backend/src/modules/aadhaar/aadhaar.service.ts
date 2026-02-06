import { aadhaarOcrV1Provider } from './providers/ocrV1.provider';
import { aadhaarOcrV2Provider } from './providers/ocrV2.provider';
import { fetchEAadhaarProvider } from './providers/fetchEAadhaar.provider';
import { FetchEAadhaarRequest } from '../../common/types/eaadhaar';
import { generateOtpV2Provider, GenerateOtpV2Request } from './providers/generateOtpV2.provider';
import { submitOtpV2Provider, SubmitOtpV2Request } from './providers/submitOtpV2.provider';

export class AadhaarService {
  // For base64 image OCR (V1) - Legacy
  async ocrV1(base64_data: string, consent: string) {
    return aadhaarOcrV1Provider(base64_data, consent);
  }

  // For file upload OCR (V2) - Legacy
  async ocrV2(
    file_front: Buffer,
    file_front_name: string,
    consent: string,
    file_back?: Buffer,
    file_back_name?: string,
  ) {
    return aadhaarOcrV2Provider(file_front, file_front_name, consent, file_back, file_back_name);
  }

  // Legacy e-Aadhaar fetch
  async fetchEAadhaar(payload: FetchEAadhaarRequest) {
    return fetchEAadhaarProvider(payload);
  }

  // QuickEKYC Aadhaar V2 - Generate OTP
  async generateOtpV2(payload: GenerateOtpV2Request) {
    return generateOtpV2Provider(payload);
  }

  // QuickEKYC Aadhaar V2 - Submit OTP
  async submitOtpV2(payload: SubmitOtpV2Request) {
    return submitOtpV2Provider(payload);
  }
}
