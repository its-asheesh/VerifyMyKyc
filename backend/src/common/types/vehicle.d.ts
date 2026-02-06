// RcVerificationApiTypes.ts

//Fetch RC Lite
export interface RcFetchLiteRequest {
  rc_number: string;
  consent: string;
}

export interface RcFetchLiteResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
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
  };
  timestamp: number;
  path: string;
}

//Fetch RC Detailed
export interface RcFetchDetailedRequest {
  rc_number: string;
  extract_variant?: boolean;
  extract_mapping?: string;
  extract_insurer?: string;
  consent: 'Y' | 'N';
}

export interface RcFetchDetailedResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
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

//Fetch RC Detailed Challan
export interface RcFetchDetailedChallanRequest {
  rc_number: string;
  extract_variant?: boolean;
  extract_mapping?: string;
  consent: 'Y' | 'N';
}

export interface RcFetchDetailedChallanResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
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

//Fetch RC E-challan
export interface RcEchallanFetchRequest {
  rc_number: string;
  chassis_number: string;
  engine_number: string;
  state_portals?: string[];
  consent: string;
}

export interface RcEchallanFetchResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
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

// Fetch Vehicle Reg Number by Chassis
export interface RcFetchRegNumByChassisRequest {
  chassis_number: string;
  consent: 'Y' | 'N';
}

export interface RcFetchRegNumByChassisResponse {
  request_id: string;
  transaction_id: string;
  reference_id?: string;
  status: number;
  data: {
    code: string;
    message: string;
    vehicle_details?: Array<{
      rc_registration_number: string;
      chassis_number: string;
    }>;
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

// Fetch Vehicle Fastag Details
export interface RcFastagFetchRequest {
  rc_number?: string;
  tag_id?: string;
  consent: string;
}

export interface RcFastagFetchResponse {
  request_id: string;
  transaction_id: string;
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

// Union types for response codes (optional, for type safety)
export type RcFetchLiteResponseCode = '1000' | '1001' | '1002';
export type RcFetchDetailedResponseCode = '1000' | '1001' | '1002';
export type RcFetchDetailedChallanResponseCode = '1000' | '1001' | '1002' | '1003' | '1004';
export type RcEchallanFetchResponseCode = '1005' | '1006';
export type RcFetchRegNumByChassisResponseCode = '1007' | '1008';
export type RcFastagFetchResponseCode = '1009' | '1010';

// Export all request and response types
export type {
  RcFetchLiteRequest,
  RcFetchLiteResponse,
  RcFetchDetailedRequest,
  RcFetchDetailedResponse,
  RcFetchDetailedChallanRequest,
  RcFetchDetailedChallanResponse,
  RcEchallanFetchRequest,
  RcEchallanFetchResponse,
  RcFetchRegNumByChassisRequest,
  RcFetchRegNumByChassisResponse,
  RcFastagFetchRequest,
  RcFastagFetchResponse,
};
