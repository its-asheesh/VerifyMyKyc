import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';

// Import Passport API types
import {
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
} from '../../../common/types/passport';

/**
 * Generates MRZ (Machine Readable Zone) from passport details.
 */
export async function generateMrzProvider(
  payload: PassportGenerateMrzRequest
): Promise<PassportGenerateMrzResponse> {
  try {
    const response = await apiClient.post('/passport-api/generate-mrz', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Failed to generate MRZ',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Verifies if the provided MRZ matches the given passport details.
 */
export async function verifyMrzProvider(
  payload: PassportVerifyMrzRequest
): Promise<PassportVerifyMrzResponse> {
  try {
    const response = await apiClient.post('/passport-api/verify-mrz', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'MRZ verification failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Verifies passport details (file number, DOB, name, etc.) against government database.
 */
export async function verifyPassportProvider(
  payload: PassportVerifyRequest
): Promise<PassportVerifyResponse> {
  try {
    const response = await apiClient.post('/passport-api/verify', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Passport verification failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Fetches passport details using file number and date of birth.
 */
export async function fetchPassportDetailsProvider(
  payload: PassportFetchRequest
): Promise<PassportFetchResponse> {
  try {
    const response = await apiClient.post('/passport-api/fetch', payload);
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'Failed to fetch passport details',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Performs OCR on passport image/PDF to extract structured data.
 * Uses multipart/form-data for file upload.
 */
export async function extractPassportOcrDataProvider(
  payload: PassportOcrRequest
): Promise<PassportOcrResponse> {
  try {
    const formData = new FormData();
    
    if (payload.file_front) {
      formData.append('file_front', payload.file_front);
    }
    if (payload.file_back) {
      formData.append('file_back', payload.file_back);
    }
    formData.append('consent', payload.consent);

    const response = await apiClient.post('/passport-api/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || 'OCR extraction failed',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

// Export all passport provider functions
export default {
  generateMrzProvider,
  verifyMrzProvider,
  verifyPassportProvider,
  fetchPassportDetailsProvider,
  extractPassportOcrDataProvider,
};