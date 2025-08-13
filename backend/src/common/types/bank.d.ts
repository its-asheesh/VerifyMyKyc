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


