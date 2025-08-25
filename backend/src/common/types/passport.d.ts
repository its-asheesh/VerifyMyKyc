// passport.d.ts

// --------------------------
// 1. Generate MRZ
// --------------------------
export interface PassportGenerateMrzRequest {
  country_code: string;
  passport_number: string;
  surname: string;
  given_name: string;
  gender: string;
  date_of_birth: string;
  date_of_expiry: string;
  consent: 'Y' | 'N';
}

export interface PassportGenerateMrzResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data: {
    code: PassportGenerateMrzResponseCode;
    message: string;
    mrz_data?: {
      first_line: string;
      second_line: string;
    };
  };
  timestamp: number;
  path: string;
}

// --------------------------
// 2. Verify MRZ
// --------------------------
export interface PassportVerifyMrzRequest {
  country_code: string;
  passport_number: string;
  surname: string;
  given_name: string;
  gender: string;
  date_of_birth: string;
  date_of_expiry: string;
  mrz_first_line: string;
  mrz_second_line: string;
  consent: 'Y' | 'N';
}

export interface PassportVerifyMrzResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data: {
    code: PassportVerifyMrzResponseCode;
    message: string;
  };
  timestamp: number;
  path: string;
}

// --------------------------
// 3. Passport Verify
// --------------------------
export interface PassportVerifyRequest {
  file_number: string;
  passport_number: string;
  surname: string;
  given_name: string;
  date_of_birth: string;
  consent: 'Y' | 'N';
}

export interface PassportVerifyResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data: {
    code: PassportVerifyResponseCode;
    message: string;
  };
  error?: {
    code: string;
    message: string;
    type?: string;
    metadata?: {
      fields?: Array<{
        field: string;
        message: string;
      }>;
    };
  };
  timestamp: number;
  path: string;
}

// --------------------------
// 4. Passport Fetch
// --------------------------
export interface PassportFetchRequest {
  file_number: string;
  date_of_birth: string;
  consent: 'Y' | 'N';
}

export interface PassportFetchResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data: {
    code: PassportFetchResponseCode;
    message?: string;
    passport_data?: {
      document_type: string;
      document_id: string;
      file_number: string;
      first_name: string;
      last_name: string;
      date_of_birth: string;
      application_received_date: string;
    };
  };
  error?: {
    code: string;
    message: string;
    type?: string;
    metadata?: {
      fields?: Array<{
        field: string;
        message: string;
      }>;
    };
  };
  timestamp: number;
  path: string;
}

// --------------------------
// 5. Passport OCR
// --------------------------
export interface PassportOcrRequest {
  file_front: Blob;
  file_back?: Blob;
  consent: 'Y' | 'N';
}

export interface PassportOcrResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data?: {
    code: PassportOcrResponseCode;
    message: string;
    ocr_data?: {
      document_id: string;
      country_code: string;
      first_name: string;
      last_name: string;
      full_name: string;
      file_number: string;
      gender: string;
      date_of_birth: string;
      issue_date: string;
      valid_till: string;
      address: string;
      nationality: string;
      country: string;
      guardian_name: string;
      mother_name: string;
      place_of_birth: string;
      place_of_issue: string;
    };
  };
  error?: {
    code: PassportOcrErrorResponseCode;
    message: string;
    type?: string;
    metadata?: {
      fields?: Array<{
        field: string;
        message: string;
      }>;
    };
  };
  timestamp: number;
  path: string;
}

// --------------------------
// Response Code Union Types
// --------------------------
export type PassportGenerateMrzResponseCode = '1000';
export type PassportVerifyMrzResponseCode = '1001' | '1002';
export type PassportVerifyResponseCode = '1003' | '1004' | '1005';
export type PassportFetchResponseCode = '1003' | '1005' | '1006';
export type PassportOcrResponseCode = '1007';
export type PassportOcrErrorResponseCode =
  | 'BAD_REQUEST'
  | 'FILE_REQUIRED'
  | 'FILE_SIZE_EXCEEDED'
  | 'INVALID_PASSPORT_DOCUMENT';

// --------------------------
// Export All Types
// --------------------------
export type {
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
};