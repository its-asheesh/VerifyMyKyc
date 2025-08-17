// GSTIN Contact Details

export interface GstinContactDetailsRequest {
    gstin: string;      // 15-digit alphanumeric GSTIN
    consent: string;    // "Y" for Yes, "N" for No
  }
  
  export interface GstinContactDetailsResponse {
    request_id: string;
    transaction_id: string;
    status: number;
    data: {
      code: string;
      message: string;
      gstin_data?: {
        document_type: string; // e.g., "GSTIN"
        email?: string;        // e.g., "abc@gmail.com"
        mobile?: string;       // e.g., "9999999999"
      };
    };
    timestamp: number;
    path: string;
  }


/** Request body for Fetch GSTIN Lite API */
export interface FetchGstinLiteRequest {
    gstin: string;                    // GSTIN number to fetch
    include_hsn_data?: boolean;       // Optional: include HSN data
    include_filing_data?: boolean;    // Optional: include filing data
    include_filing_frequency?: boolean; // Optional: include filing frequency
    consent: 'Y' | 'N';                // Required: user consent
  }
  
  /** GSTIN details returned from API */
  export interface GstinData {
    document_type: string;
    document_id: string;
    status: string;
    pan: string;
    legal_name: string;
    trade_name?: string;
    center_jurisdiction?: string;
    state_jurisdiction?: string;
    constitution_of_business?: string;
    taxpayer_type?: string;
    aadhar_verified?: boolean;
    ekyc_verified?: boolean;
    field_visit_conducted?: boolean;
    date_of_registration?: string;
    principal_address?: {
      address: string;
    };
    hsn_data?: {
      services?: Array<Record<string, unknown>>;
    };
  }
  
  /** Response object for Fetch GSTIN Lite API */
  export interface FetchGstinLiteResponse {
    request_id: string;
    status: number;  // e.g., 200
    data: {
      code: string;    // API-specific code e.g., "1000"
      message: string; // e.g., "Valid GSTIN"
      gstin_data?: GstinData;
    };
    timestamp: number;
    path: string;
  }
  