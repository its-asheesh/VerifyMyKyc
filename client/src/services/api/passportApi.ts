import BaseApi from './baseApi';
import type {
  PassportGenerateMrzRequest,
  PassportGenerateMrzResponse,
  PassportVerifyMrzRequest,
  PassportVerifyMrzResponse,
  PassportVerifyRequest,
  PassportVerifyResponse,
  PassportFetchRequest,
  PassportFetchResponse,
  PassportOcrRequest,
  PassportOcrResponse,
} from '../../types/kyc';

class PassportApi extends BaseApi {
  /**
   * Generate MRZ (Machine Readable Zone) from passport details.
   */
  async generateMrz(data: PassportGenerateMrzRequest): Promise<PassportGenerateMrzResponse> {
    return this.post('/passport/mrz/generate', data);
  }

  /**
   * Verify if the provided MRZ matches the given passport details.
   */
  async verifyMrz(data: PassportVerifyMrzRequest): Promise<PassportVerifyMrzResponse> {
    return this.post('/passport/mrz/verify', data);
  }

  /**
   * Verify passport details against government database.
   */
  async verifyPassport(data: PassportVerifyRequest): Promise<PassportVerifyResponse> {
    return this.post('/passport/verify', data);
  }

  /**
   * Fetch passport details using file number and date of birth.
   */
  async fetchPassportDetails(data: PassportFetchRequest): Promise<PassportFetchResponse> {
    return this.post('/passport/fetch', data);
  }

  /**
   * Extract data from passport using OCR.
   */
  async extractPassportOcrData(data: PassportOcrRequest): Promise<PassportOcrResponse> {
    // For file uploads, we need to handle multipart/form-data
    const formData = new FormData();
    
    if (data.file_front) {
      formData.append('file_front', data.file_front);
    }
    if (data.file_back) {
      formData.append('file_back', data.file_back);
    }
    formData.append('consent', data.consent);

    return this.post('/passport/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Public post method for generic use (inherited from BaseApi)
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config);
  }
}

export const passportApi = new PassportApi('/api');