// ccrv.d.ts

export interface CCRVCallbackData {
  transactionId: string;
  referenceId?: string;
  payload: any; // Or define a more specific response type
}
// --------------------------
// 1. CCRV Generate Report
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

// --------------------------
// 2. CCRV Fetch Result
// --------------------------
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

// --------------------------
// 3. CCRV Search
// --------------------------
export interface CCRVSearchRequest {
  name: string;
  address: string;
  father_name?: string;
  date_of_birth?: string;
  case_category?: 'CIVIL' | 'CRIMINAL';
  type?: 'PETITIONER' | 'RESPONDENT';
  name_match_type?: 'EXACT_MATCH' | 'EXACT_FUZZY' | 'PARTIAL_EXACT' | 'PARTIAL_FUZZY' | 'NO_MATCH';
  father_match_type?: 'EXACT_MATCH' | 'EXACT_FUZZY' | 'PARTIAL_EXACT' | 'PARTIAL_FUZZY' | 'NO_MATCH';
  jurisdiction_type?: 'STATE' | 'DISTRICT' | 'NEAREST_DISTRICTS' | 'PAN_INDIA';
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

// --------------------------
// Export All Types
// --------------------------
export type {
  CCRVGenerateReportRequest,
  CCRVGenerateReportResponse,
  CCRVFetchResultRequest,
  CCRVFetchResultResponse,
  CCRVSearchRequest,
  CCRVSearchResponse,
};