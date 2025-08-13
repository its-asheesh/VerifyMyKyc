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

// GSTIN: Common Types
interface GstinAddress {
  address: string;
  [key: string]: any;
}

interface GstinHsnData {
  services: Array<{
    // Add HSN service item fields as needed
    [key: string]: any;
  }>;
}

// GSTIN: Lite Request
export interface GstinLiteRequest {
  gstin: string;
  include_hsn_data?: boolean;
  include_filing_data?: boolean;
  include_filing_frequency?: boolean;
  consent: 'Y' | 'N';
}

// GSTIN: Contact Details
export interface GstinContactRequest {
  gstin: string;
  consent: 'Y' | 'N';
}

// GSTIN: Common Response
export interface GstinBaseResponse {
  request_id: string;
  status: number;
  data: {
    code: string;
    message: string;
    gstin_data: {
      document_type: string;
      document_id: string;
      status: string;
      pan: string;
      legal_name: string;
      trade_name: string;
      center_jurisdiction: string;
      state_jurisdiction: string;
      constitution_of_business: string;
      taxpayer_type: string;
      aadhaar_verified: boolean;
      ekyc_verified: boolean;
      field_visit_conducted: boolean;
      date_of_registration: string;
      principal_address: GstinAddress;
      hsn_data?: GstinHsnData;
      // Include other fields from the API response
      [key: string]: any;
    };
  };
  timestamp: number;
  path: string;
}

export interface GstinContactResponse {
  document_type: string;
  email: string;
  mobile: string;
  [key: string]: any;
}

// GSTIN: Fetch by PAN
export interface GstinByPanRequest {
  pan_number: string;
  consent: string;
}
export interface GstinByPanResponse {
  request_id: string;
  transaction_id: string;
  reference_id: string;
  status: number;
  data: {
    code: string;
    message: string;
    gstin_list: string[];
    gstin_details: Array<{
      gstin: string;
      legal_name: string;
      trade_name: string;
      registration_date: string;
      constitution_of_business: string;
      taxpayer_type: string;
      gstin_status: string;
      last_update_date: string;
      cancellation_date?: string;
    }>;
  };
  timestamp: number;
  path: string;
  [key: string]: any;
}
