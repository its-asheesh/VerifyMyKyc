// Voter API Types

export interface VoterBosonFetchRequest {
  voter_id: string; // 10-character alphanumeric ID
  consent: 'Y' | 'N';
}

export interface VoterData {
  document_type: string; // VOTER
  name?: string;
  father_name?: string;
  husband_name?: string;
  gender?: string;
  age?: string;
  address?: string;
  district?: string;
  state?: string;
  assembly_constituency_number?: string;
  assembly_constituency_name?: string;
  parliamentary_constituency_name?: string;
  part_number?: string;
  part_name?: string;
  serial_number?: string;
  polling_station?: string;
}

export interface VoterBosonFetchResponse {
  request_id: string;
  transaction_id?: string;
  reference_id?: string;
  status: number;
  data: {
    code: string;
    message: string;
    voter_data?: VoterData;
  };
  timestamp: number;
  path: string;
}

export interface VoterMesonInitResponse {
  request_id: string;
  transaction_id: string;
  status: number;
  data: {
    code: string;
    transaction_id: string;
    message: string;
    captcha_base64: string;
  };
  timestamp: number;
  path: string;
}

export interface VoterMesonFetchRequest {
  voter_id: string;
  captcha: string;
  transaction_id: string;
  consent: 'Y' | 'N';
}

export interface VoterMesonFetchResponse extends VoterBosonFetchResponse {}

export interface VoterOcrResponse {
  request_id: string;
  transaction_id?: string;
  status: number;
  data: {
    code: string; // e.g., 1008
    message: string;
    ocr_data?: {
      voter_id_number?: string;
      id_number?: string; // alternate key in some responses
      name?: string;
      date_of_birth?: string;
      issue_date?: string;
      state?: string;
    };
  };
  timestamp: number;
  path: string;
}
