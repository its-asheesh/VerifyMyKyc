export interface BankAccountVerifyRequest {
  account_number: string;
  ifsc: string;
  consent: 'Y' | 'N';
}

export interface BankAccountData {
  reference_id: string;
  name: string;
  bank_name: string;
  utr: string;
  city: string;
  branch: string;
  micr: string;
  account_number?: string;
  ifsc?: string;
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

// IFSC Validation Types
export interface IfscValidateRequest {
  ifsc: string;
  consent: 'Y' | 'N';
}

export interface BankIfscData {
  status: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  address: string;
  city: string;
  state: string;
  payment_channels: {
    neft?: string;
    imps?: string;
    rtgs?: string;
    upi?: string;
    fund_transfer?: string;
    card?: string;
  };
  micr_code?: string;
  nbin_code?: string;
  ifsc_subcode?: string;
  [key: string]: any;
}

export interface IfscValidateResponse {
  request_id: string;
  transaction_id: string;
  status: number;
  data: {
    code: string; // e.g., "1041"
    message: string;
    bank_ifsc_data?: BankIfscData;
    [key: string]: any;
  };
  timestamp: number;
  path: string;
  [key: string]: any;
}

// UPI Verification Types
export interface UpiVerifyRequest {
  upi: string; // UPI ID (VPA) - e.g., "user@paytm"
  consent: 'Y' | 'N';
}

export interface UpiData {
  name: string; // Account holder name
  [key: string]: any;
}

export interface UpiVerifyResponse {
  request_id: string;
  transaction_id: string;
  reference_id?: string;
  status: number;
  data: {
    code: string; // e.g., "1013" for valid, "1014" for invalid
    message: string;
    upi_data?: UpiData;
    [key: string]: any;
  };
  timestamp: number;
  path: string;
  [key: string]: any;
}
