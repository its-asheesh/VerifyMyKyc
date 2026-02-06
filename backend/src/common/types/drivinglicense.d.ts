export interface DrivingLicenseFetchDetailsRequest {
  driving_license_number: string;
  date_of_birth: string;
  consent: string;
}

export interface DrivingLicenseFetchDetailsResponse {
  status: string;
  message: string;
  license_details?: any;
  [key: string]: any;
}

export interface DrivingLicenseOcrRequest {
  file_front: Buffer;
  file_back?: Buffer;
  consent: string;
}

export interface DrivingLicenseOcrResponse {
  status: string;
  message: string;
  ocr_data?: any;
  [key: string]: any;
}
