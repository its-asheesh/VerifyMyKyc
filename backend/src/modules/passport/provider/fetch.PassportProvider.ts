import apiClient from '../../../common/http/apiClient';
import { HTTPError } from '../../../common/http/error';
import { AxiosResponse } from 'axios';

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
 * A generic helper to wrap API calls, handle responses, and standardize error handling.
 * @param requestPromise A promise returned by an apiClient call.
 * @param defaultErrorMessage A fallback error message.
 * @returns The data from the API response.
 */
async function handleProviderRequest<T>(
  requestPromise: Promise<AxiosResponse<T>>,
  defaultErrorMessage: string,
): Promise<T> {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error: any) {
    throw new HTTPError(
      error.response?.data?.message || defaultErrorMessage,
      error.response?.status || 500,
      error.response?.data,
    );
  }
}

/**
 * Generates MRZ (Machine Readable Zone) from passport details.
 */
export async function generateMrzProvider(
  payload: PassportGenerateMrzRequest,
): Promise<PassportGenerateMrzResponse> {
  return handleProviderRequest(
    apiClient.post('/passport-api/generate-mrz', payload),
    'Failed to generate MRZ',
  );
}

/**
 * Verifies if the provided MRZ matches the given passport details.
 */
export async function verifyMrzProvider(
  payload: PassportVerifyMrzRequest,
): Promise<PassportVerifyMrzResponse> {
  return handleProviderRequest(
    apiClient.post('/passport-api/verify-mrz', payload),
    'MRZ verification failed',
  );
}

/**
 * Verifies passport details (file number, DOB, name, etc.) against government database.
 */
export async function verifyPassportProvider(
  payload: PassportVerifyRequest,
): Promise<PassportVerifyResponse> {
  return handleProviderRequest(
    apiClient.post('/passport-api/verify', payload),
    'Passport verification failed',
  );
}

/**
 * Fetches passport details using file number and date of birth.
 */
export async function fetchPassportDetailsProvider(
  payload: PassportFetchRequest,
): Promise<PassportFetchResponse> {
  return handleProviderRequest(
    apiClient.post('/passport-api/fetch', payload),
    'Failed to fetch passport details',
  );
}

/**
 * Performs OCR on passport image/PDF to extract structured data.
 * Uses multipart/form-data for file upload.
 */
export async function extractPassportOcrDataProvider(
  payload: PassportOcrRequest,
): Promise<PassportOcrResponse> {
  const formData = new FormData();

  if (payload.file_front) {
    formData.append('file_front', payload.file_front);
  }
  if (payload.file_back) {
    formData.append('file_back', payload.file_back);
  }
  formData.append('consent', payload.consent);

  return handleProviderRequest(
    apiClient.post('/passport-api/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    'OCR extraction failed',
  );
}
