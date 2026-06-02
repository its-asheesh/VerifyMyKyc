export interface FetchCompanyRequest {
  company_id: string; // CIN, FCRN, or LLPIN
  consent: 'Y' | 'N' | string;
}

export interface FetchCompanyResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: {
    code?: string;
    message?: string;
    company_data?: {
      company_details?: Record<string, any>;
      [key: string]: any;
    };
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

export interface FetchDirectorRequest {
  din: string;
  consent: 'Y' | 'N' | string;
}

export interface FetchDirectorResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: Record<string, any>;
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

export interface FetchByNameRequest {
  name: string;
  consent: 'Y' | 'N' | string;
}

export interface FetchByNameResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: Record<string, any>;
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

export interface FetchPanByDinRequest {
  din: string;
  consent: 'Y' | 'N' | string;
}

export interface FetchPanByDinResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: Record<string, any>;
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

export interface VerifyTanRequest {
  tan: string;
  consent: 'Y' | 'N' | string;
}

export interface VerifyTanResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: Record<string, any>;
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

export interface FetchContactDetailsByDinRequest {
  din: string;
  consent: 'Y' | 'N' | string;
}

export interface FetchContactDetailsByDinResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: Record<string, any>;
  timestamp?: number;
  path?: string;
  [key: string]: any;
}

// CIN by PAN
export interface CinByPanRequest {
  pan_number: string;
  consent: 'Y' | 'N' | string;
}

export interface CinByPanResponse {
  request_id?: string;
  transaction_id?: string;
  reference_id?: string;
  status: number | string;
  data?: {
    code?: string;
    message?: string;
    cin_list?: string[];
    cin_details?: Array<{
      cin: string;
      entity_name?: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  timestamp?: number;
  path?: string;
  [key: string]: any;
}
