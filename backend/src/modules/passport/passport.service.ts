import {
  generateMrzProvider,
  verifyMrzProvider,
  verifyPassportProvider,
  fetchPassportDetailsProvider,
  extractPassportOcrDataProvider,
} from './provider/fetch.PassportProvider';

// Import request types
import {
  PassportGenerateMrzRequest,
  PassportVerifyMrzRequest,
  PassportVerifyRequest,
  PassportFetchRequest,
  PassportOcrRequest,
} from '../../common/types/passport';

// Import response types (optional but good for type safety)
import {
  PassportGenerateMrzResponse,
  PassportVerifyMrzResponse,
  PassportVerifyResponse,
  PassportFetchResponse,
  PassportOcrResponse,
} from '../../common/types/passport';

export class PassportService {
  /**
   * Generates MRZ (Machine Readable Zone) from passport details.
   */
  async generateMrz(payload: PassportGenerateMrzRequest): Promise<PassportGenerateMrzResponse> {
    return generateMrzProvider(payload);
  }

  /**
   * Verifies if the provided MRZ matches the given passport details.
   */
  async verifyMrz(payload: PassportVerifyMrzRequest): Promise<PassportVerifyMrzResponse> {
    return verifyMrzProvider(payload);
  }

  /**
   * Verifies passport details (file number, DOB, name, etc.) against government database.
   */
  async verifyPassport(payload: PassportVerifyRequest): Promise<PassportVerifyResponse> {
    return verifyPassportProvider(payload);
  }

  /**
   * Fetches passport details using file number and date of birth.
   */
  async fetchPassportDetails(payload: PassportFetchRequest): Promise<PassportFetchResponse> {
    return fetchPassportDetailsProvider(payload);
  }

  /**
   * Performs OCR on passport image/PDF to extract structured data.
   */
  async extractPassportOcrData(payload: PassportOcrRequest): Promise<PassportOcrResponse> {
    return extractPassportOcrDataProvider(payload);
  }
}
