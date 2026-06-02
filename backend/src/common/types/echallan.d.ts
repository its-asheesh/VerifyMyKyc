export interface EChallanFetchRequest {
  rc_number: string;
  chassis_number: string;
  engine_number: string;
  consent: string;
}

export interface EChallanFetchResponse {
  status: string;
  message: string;
  challan_details?: any;
  [key: string]: any;
}
