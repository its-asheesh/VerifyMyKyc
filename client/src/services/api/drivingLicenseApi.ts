import BaseApi from "./baseApi"

export interface DrivingLicenseOcrRequest {
  file_front: File;
  file_back?: File;
  consent: string;
}

export interface DrivingLicenseOcrResponse {
  data: any;
}

export interface DrivingLicenseFetchDetailsRequest {
  driving_license_number: string;
  date_of_birth: string;
  consent: string;
}

export interface DrivingLicenseFetchDetailsResponse {
  data: any;
}

class DrivingLicenseApi extends BaseApi {
  async ocr(data: FormData): Promise<DrivingLicenseOcrResponse> {
    return this.post("/drivinglicense/ocr", data, { headers: { "Content-Type": "multipart/form-data" } })
  }
  async fetchDetails(data: DrivingLicenseFetchDetailsRequest): Promise<DrivingLicenseFetchDetailsResponse> {
    return this.post("/drivinglicense/fetch-details", data)
  }
}

export const drivingLicenseApi = new DrivingLicenseApi("/api") 