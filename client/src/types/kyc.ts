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

// Aadhaar V2 - QuickEKYC
export interface AadhaarV2GenerateOtpRequest {
  id_number: string; // 12-digit Aadhaar number
  consent: string;
}

export interface AadhaarV2GenerateOtpResponse {
  data: {
    otp_sent: boolean;
    if_number: boolean;
    valid_aadhaar: boolean;
  };
  status_code: number;
  message: string;
  status: string;
  request_id: number;
}

export interface AadhaarV2Address {
  dist?: string;
  house?: string;
  country?: string;
  subdist?: string;
  vtc?: string;
  po?: string;
  state?: string;
  street?: string;
  loc?: string;
}

export interface AadhaarV2SubmitOtpRequest {
  request_id: string | number;
  otp: string;
  client_id?: string;
  consent: string;
}

export interface AadhaarV2SubmitOtpResponse {
  data: {
    aadhaar_number: string;
    dob: string; // yyyy-mm-dd
    zip?: string;
    full_name: string;
    gender?: string;
    address?: AadhaarV2Address;
    client_id?: string;
    profile_image?: string;
    zip_data?: string;
    raw_xml?: string;
    share_code?: string;
    care_of?: string;
  };
  status_code: number;
  message: string;
  status: string;
  request_id: number;
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

// PAN: Advance
export interface FetchPanAdvanceRequest {
  pan_number: string;
  consent: string;
}

export interface FetchPanAdvanceResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data: {
    code: string;
    message: string;
    pan_data?: any;
    [key: string]: any;
  };
  timestamp?: number; // Often included in API responses
  path?: string;     // Often included in API responses
  [key: string]: any; // Top-level flexibility
}

// PAN: Detailed
export interface FetchPanDetailedRequest {
  pan_number: string;
  consent: string;
}

export interface AddressData {
  line_1: string;
  line_2: string;
  street: string;
  city: string;
  line_5: string;
  state: string;
  pincode: string;
}

export interface PanDetails {
  document_type: string;
  document_id: string;
  name: string;
  last_name: string;
  category: string;
  date_of_birth: string; // YYYY-MM-DD
  masked_aadhaar_number: string;
  address_data: AddressData;
  email: string;
  phone: string;
  gender: string;
  aadhaar_linked: boolean;
}

export interface FetchPanDetailedResponse {
  status: string;
  message: string;
  pan_details?: PanDetails;
  timestamp?: number;
  path?: string;
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
  request_id: string;
  transaction_id: string;
  reference_id?: string;
  status: number; // e.g., 200
  data: {
    code: string; // e.g., "1000"
    message: string;
    bank_account_data?: BankAccountData;
    [key: string]: any;
  };
  timestamp: number;
  path: string;
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

// RC: Lite
export interface RcFetchLiteRequest {
  rc_number: string;
  consent: string;
}

export interface RcFetchLiteResponse {
  status: number;
  data: {
    code: string;
    message: string;
    rc_data?: {
      document_type: string;
      owner_data: {
        serial: string;
        name: string;
      };
      issue_date: string;
      expiry_date: string;
      status: string;
      norms_type: string;
      financed: boolean;
      pucc_data: {
        expiry_date: string;
      };
      insurance_data: {
        expiry_date: string;
      };
      vehicle_data: {
        category_description: string;
        chassis_number: string;
        engine_number: string;
        maker_model: string;
        fuel_type: string;
        color: string;
        unladen_weight: string;
      };
    };
    [key: string]: any;
  };
  timestamp: number;
  path: string;
  [key: string]: any;
}

// RC: Detailed
export interface RcFetchDetailedRequest {
  rc_number: string;
  extract_variant?: boolean;
  extract_mapping?: string;
  extract_insurer?: string;
  consent: 'Y' | 'N';
}

export interface RcFetchDetailedResponse {
  status: number;
  data: {
    code: string;
    message: string;
    rc_data?: {
      document_type?: string;
      owner_data?: {
        serial?: string;
        name?: string;
        father_name?: string;
        present_address?: string;
        permanent_address?: string;
      };
      issue_date?: string;
      expiry_date?: string;
      registered_at?: string;
      status?: string;
      blacklist_status?: string;
      noc_details?: string;
      norms_type?: string;
      tax_end_date?: string;
      non_use_status?: string;
      non_use_from?: string;
      non_use_to?: string;
      financier?: string;
      financed?: boolean;
      pucc_data?: {
        pucc_number?: string;
        expiry_date?: string;
      };
      insurance_data?: {
        policy_number?: string;
        company?: string;
        expiry_date?: string;
        custom_data?: Record<string, any>;
      };
      permit_data?: {
        permit_number?: string;
        type?: string;
        issue_date?: string;
        expiry_date?: string;
      };
      national_permit_data?: {
        permit_number?: string;
        issued_by?: string;
        issue_date?: string;
        expiry_date?: string;
      };
      vehicle_data?: {
        manufactured_date?: string;
        variant?: string;
        category?: string;
        category_description?: string;
        chassis_number?: string;
        engine_number?: string;
        maker_description?: string;
        maker_model?: string;
        body_type?: string;
        fuel_type?: string;
        color?: string;
        cubic_capacity?: string;
        gross_weight?: string;
        number_of_cylinders?: string;
        seating_capacity?: string;
        sleeper_capacity?: string;
        standing_capacity?: string;
        wheelbase?: string;
        unladen_weight?: string;
        custom_data?: Record<string, any>;
      };
    };
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

// RC: Detailed with Challan
export interface RcFetchDetailedChallanRequest {
  rc_number: string;
  extract_variant?: boolean;
  extract_mapping?: string;
  consent: 'Y' | 'N';
}

export interface RcFetchDetailedChallanResponse {
  status: number;
  data: {
    code: string;
    message: string;
    rc_data?: {
      document_type?: string;
      owner_data?: {
        serial: string;
        name: string;
        father_name: string;
        present_address?: string;
        permanent_address?: string;
        mobile?: string;
      };
      issue_date: string;
      expiry_date: string;
      registered_at: string;
      status: string;
      blacklist_status?: string;
      noc_details?: string;
      norms_type: string;
      tax_end_date?: string;
      non_use_status?: string;
      non_use_from?: string;
      non_use_to?: string;
      financier?: string;
      financed: boolean;
      pucc_data: {
        pucc_number: string;
        expiry_date: string;
      };
      insurance_data: {
        policy_number: string;
        company: string;
        expiry_date: string;
      };
      vehicle_data: {
        manufactured_date?: string;
        variant: string;
        category: string;
        category_description?: string;
        chassis_number: string;
        engine_number: string;
        maker_description: string;
        maker_model: string;
        body_type: string;
        fuel_type: string;
        color: string;
        cubic_capacity: string;
        gross_weight: string;
        number_of_cylinders: string;
        seating_capacity: string;
        sleeper_capacity?: string;
        standing_capacity: string;
        wheelbase: string;
        unladen_weight: string;
        custom_data?: Record<string, any>;
      };
    };
    [key: string]: any;
  };
  challan_data?: Array<{
    document_type: string;
    document_id: string;
    status: string;
    area_name: string;
    area_coordinates: string;
    date_issued: string;
    accused_name: string;
    owner_name: string;
    offence_data: Array<{
      offence_id: string;
      offence_description: string;
    }>;
    amount: number;
    rto_name: string;
    state: string;
    receipt_url: string;
  }>;
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

// RC: E-Challan
export interface RcEchallanFetchRequest {
  rc_number: string;
  chassis_number: string;
  engine_number: string;
  state_portals?: string[];
  consent: string;
}

export interface RcEchallanFetchResponse {
  status: number;
  data?: {
    code: string;
    message: string;
    challan_data?: Array<{
      document_type: string;
      document_id: string;
      status: string;
      area_name: string;
      date_issued: string;
      accused_name: string;
      offence_data: Array<{
        offence_description: string;
      }>;
      amount: number;
      rto_name?: string;
      state: string;
    }>;
    [key: string]: any;
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
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

// RC: Registration Number by Chassis
export interface RcFetchRegNumByChassisRequest {
  chassis_number: string;
  consent: 'Y' | 'N';
}

export interface RcFetchRegNumByChassisResponse {
  status: number;
  data: {
    code: string;
    message: string;
    vehicle_details?: Array<{
      rc_registration_number: string;
      chassis_number: string;
    }>;
    [key: string]: any;
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
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

// RC: Fastag Details
export interface RcFastagFetchRequest {
  rc_number?: string;
  tag_id?: string;
  consent: string;
}

export interface RcFastagFetchResponse {
  status: number;
  data: {
    code: string;
    message: string;
    vehicle_fastag_data?: {
      rc_number: string;
      active_tag_age: string;
      tags_summary?: {
        total_tags: number;
        active_tags: number;
        inactive_tags: number;
      };
      fastag_records: Array<{
        tag_id: string;
        vrn: string;
        tag_status: string;
        vehicle_class: string;
        action: string;
        issue_date: string;
        issuer_bank: string;
      }>;
    };
    [key: string]: any;
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
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

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
    code: '1000';
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
    code: '1001' | '1002';
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
    code: '1003' | '1004' | '1005';
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
    code: '1003' | '1005' | '1006';
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
  file_front: File;
  file_back?: File;
  consent: 'Y' | 'N';
}

export interface PassportOcrResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data?: {
    code: '1007';
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
    code: 'BAD_REQUEST' | 'FILE_REQUIRED' | 'FILE_SIZE_EXCEEDED' | 'INVALID_PASSPORT_DOCUMENT';
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
// CCRV Types
// --------------------------
export interface CCRVGenerateReportRequest {
  name: string;
  father_name?: string;
  house_number?: string;
  locality?: string;
  city?: string;
  village?: string;
  state?: string;
  district?: string;
  pincode?: string;
  date_of_birth?: string;
  gender?: string;
  mobile_number?: string;
  email?: string;
  consent: 'Y' | 'N';
  callback_url?: string;
}

export interface CCRVGenerateReportResponse {
  request_id: string;
  transaction_id: string;
  status: number;
  data: {
    code: '1016';
    message: string;
    transaction_id: string;
    ccrv_status: 'REQUESTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'MINOR' | 'REGION_NOT_SUPPORTED';
  };
  timestamp: number;
  path: string;
}

export interface CCRVFetchResultRequest {
  transaction_id: string;
}

export interface CCRVCase {
  address: string;
  address_district_code: string;
  address_district: string;
  address_state: string;
  address_state_code: string;
  all_candidates: string[];
  act_and_sections_raw_info: string;
  case_category: string;
  case_number: string;
  case_status: string;
  case_year: string;
  clean_name: string;
  cnr: string;
  court_code: number;
  court_complex_code: string;
  court_name: string;
  court_number_and_judge: string;
  custom_district_code: string;
  custom_state_code: string;
  decision_date: string;
  district_code: number;
  district_name: string;
  father_match_type: string;
  filing_date: string;
  fir_number: string;
  first_hearing_date: string;
  jurisdiction_type: string;
  name: string;
  name_match_type: string;
  nature_of_disposal: string;
  other_party: string;
  police_station: string;
  raw_address: string;
  registration_date: string;
  source: string;
  state_name: string;
  type: number;
  under_acts: string;
  under_sections: string;
  case_stage: string;
  fir_year: string;
  next_hearing_date: string;
  purpose_of_hearing: string;
  timestamp: number;
  acts: {
    code: string;
    description: string;
    type: string;
  }[];
  supporting_files: {
    id: string;
    file_name: string;
    side: string;
    file_type: string;
    file_url: string;
  }[];
}

export interface CCRVMatchCriteria {
  name: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';
  father_name?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';
  house_number?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';
  locality?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';
  city?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';
  village?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'NO_MATCH';
  found_near_address_type?: string;
}

export interface CCRVIndividual {
  case_decision: string;
  criminal_act_severity: 'HIGH' | 'MEDIUM' | 'LOW';
  individual_role: 'PETITIONER' | 'RESPONDENT' | 'WITNESS' | 'OTHER';
  petitioner_name: string[];
  respondent_name: string[];
  court_type: 'DISTRICT_AND_SESSION_COURT' | 'HIGH_COURT' | 'SUPREME_COURT' | 'OTHER';
  court_judge: string;
  district: string;
  state: string;
  match_type: 'PROBABLE' | 'POSSIBLE' | 'UNLIKELY';
  matchCriteria: CCRVMatchCriteria;
  case_content: string;
  evidence_files: {
    evidence_type: 'ORDER_COPY' | 'CHARGE_SHEET' | 'FIR_COPY' | 'OTHER';
    supporting_file: {
      id: string;
      file_name: string;
      side: string;
    }[];
  }[];
}

export interface CCRVFetchResultResponse {
  request_id: string;
  transaction_id: string;
  status: number;
  data?: {
    code: '1017' | '1019';
    message: string;
    transaction_id: string;
    ccrv_status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'MINOR' | 'REGION_NOT_SUPPORTED';
    ccrv_data?: {
      case_count: number;
      cases: CCRVCase[];
      individuals: CCRVIndividual[];
      report_pdf_url: string;
    };
  };
  error?: {
    code: 'INVALID_INPUT' | 'PRODUCT_CONFIGURATION_REQUIRED' | 'TRANSACTION_NOT_FOUND' | 'INVALID_TOKEN';
    message: string;
    type?: string;
  };
  timestamp: number;
  path: string;
}

export interface CCRVSearchRequest {
  name: string;
  address: string;
  father_name?: string;
  date_of_birth?: string;
  case_category?: string;
  type?: 'PETITIONER' | 'RESPONDENT' | 'WITNESS' | 'OTHER';
  name_match_type?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'FUZZY_MATCH' | 'EXACT_FUZZY';
  father_match_type?: 'EXACT_MATCH' | 'PARTIAL_MATCH' | 'FUZZY_MATCH' | 'PARTIAL_EXACT';
  jurisdiction_type?: 'NEAREST_DISTRICTS' | 'STATE_WIDE' | 'COUNTRY_WIDE';
  consent: 'Y' | 'N';
}

export interface CCRVSearchResponse {
  request_id: string;
  transaction_id: string;
  status: number;
  data: {
    code: '1016';
    message: string;
    transaction_id: string;
    ccrv_status: 'REQUESTED';
  };
  timestamp: number;
  path: string;
}
