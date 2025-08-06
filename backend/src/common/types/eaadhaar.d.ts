export interface FetchEAadhaarRequest {
  transaction_id: string;
  json?: any;
}
 
export interface FetchEAadhaarResponse {
  eaadhaar_link?: string;
  eaadhaar?: any;
  [key: string]: any;
} 