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

// GSTIN
export interface GstinByPanRequest {
  pan_number: string;
  consent: string;
}
export interface GstinByPanResponse {
  request_id: string;
  status: number;
  data: {
    code: string;
    message: string;
    results?: Array<{
      document_type: string;
      document_id: string;
      status: string;
      state: string;
      state_code: string;
    }>;
  };
  timestamp: number;
  path: string;
}
export interface GstinLiteRequest {
  gstin: string;
  consent: string;
}
export interface GstinLiteResponse {
  status: string;
  message: string;
  gstin_lite_details?: any;
  [key: string]: any;
}
export interface GstinContactRequest {
  gstin: string;
  consent: string;
}
export interface GstinContactResponse {
  email: string;
  mobile: string;
}

// MCA
export interface DinByPanRequest {
  pan_number: string;
  consent: string;
}
export interface DinByPanResponse {
  status: string;
  message: string;
  din_details?: any;
  [key: string]: any;
}

// Digilocker Issued Files
export interface DigilockerIssuedFilesRequest {
  transaction_id: string;
  reference_id?: string;
}

export interface DigilockerIssuedFilesResponse {
  status: number;
  data: {
    code: string;
    message: string;
    transaction_id: string;
    issued_files: DigilockerIssuedFileMeta[];
  };
  [key: string]: any;
}

export interface DigilockerIssuedFileMeta {
  name: string;
  type: string;
  date: string;
  mime: string[];
  uri: string;
  doc_type: string;
  description: string;
  issuer_id: string;
  issuer: string;
}

export interface DigilockerIssuedFileRequest {
  transaction_id: string;
  file_uri: string;
  format: 'JSON' | 'FILE' | 'XML';
  reference_id?: string;
}

export interface DigilockerIssuedFileResponse {
  status: number;
  data: {
    code: string;
    message: string;
    transaction_id: string;
    issued_file_link?: string;
    document?: any;
  };
  [key: string]: any;
} 