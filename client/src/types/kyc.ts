// Aadhaar OCR v1
export interface AadhaarOcrV1Request {
  base64_data: string;
  consent: string;
}
export interface AadhaarOcrV1Response {
  name: string;
  dob: string;
  gender: string;
  aadhaar_number: string;
  address: string;
  [key: string]: any;
}

// Aadhaar OCR v2
export interface AadhaarOcrV2Request {
  file_front: File;
  file_back?: File;
  consent: string;
}
export interface AadhaarOcrV2Response {
  name: string;
  dob: string;
  gender: string;
  aadhaar_number: string;
  address: string;
  [key: string]: any;
}

// Fetch eAadhaar
export interface FetchEAadhaarRequest {
  transaction_id: string;
  json: any;
}
export interface FetchEAadhaarResponse {
  eaadhaar_link?: string;
  eaadhaar?: any;
  [key: string]: any;
}

// PAN: Father's Name
export interface PanFatherNameRequest {
  pan_number: string;
  consent: string;
}
export interface PanFatherNameResponse {
  status: string;
  message: string;
  father_name?: string;
  [key: string]: any;
}

// PAN: Aadhaar Link
export interface PanAadhaarLinkRequest {
  pan_number: string;
  aadhaar_number: string;
  consent: string;
}
export interface PanAadhaarLinkResponse {
  status: string;
  message: string;
  [key: string]: any;
}

// PAN: Digilocker Init
export interface DigilockerInitRequest {
  redirect_uri: string;
  consent: string;
}
export interface DigilockerInitResponse {
  status: string;
  message: string;
  redirect_url?: string;
  [key: string]: any;
}

// PAN: Digilocker Pull
export interface PanDigilockerPullRequest {
  parameters: {
    panno: string;
    PANFullName: string;
  };
}
export interface PanDigilockerPullResponse {
  status: string;
  message: string;
  document_data?: any;
  [key: string]: any;
}

// PAN: Digilocker Fetch Document
export interface DigilockerFetchDocumentRequest {
  document_uri: string;
  transaction_id: string;
}
export interface DigilockerFetchDocumentResponse {
  status: string;
  message: string;
  document_data?: any;
  [key: string]: any;
}

// GSTIN: Contact Details
export interface GstinContactRequest {
  gstin: string;
  consent: string;
}
export interface GstinContactResponse {
  status: string;
  message: string;
  data?: any;
  [key: string]: any;
}

// GSTIN: Lite Details
export interface GstinLiteRequest {
  gstin: string;
  consent: string;
}
export interface GstinLiteResponse {
  status: string;
  message: string;
  data?: any;
  [key: string]: any;
}

// Bank: Account Verification
export interface BankAccountVerifyRequest {
  account_number: string;
  ifsc: string;
  consent: 'Y' | 'N';
}
export interface BankAccountData {
  name?: string;
  account_number?: string;
  bank_name?: string;
  branch?: string;
  ifsc?: string;
  micr?: string;
  city?: string;
  utr?: string;
  reference_id?: string;
  [key: string]: any;
}
export interface BankAccountVerifyResponse {
  status: number; // e.g., 200
  data: {
    code: string; // e.g., "1000"
    message: string;
    bank_account_data?: BankAccountData;
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

// Bank: IFSC Validate
export interface IfscValidateRequest {
  ifsc: string;
  consent: string;
}
export interface IfscValidateResponse {
  status?: string;
  message?: string;
  data?: any;
  [key: string]: any;
}

// Bank: UPI Verify
export interface UpiVerifyRequest {
  vpa: string; // UPI ID
  consent: string;
}
export interface UpiVerifyResponse {
  status?: string;
  message?: string;
  data?: any;
  [key: string]: any;
}
