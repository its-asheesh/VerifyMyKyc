import BaseApi from "./baseApi"
import type {
  AadhaarOcrV1Request,
  AadhaarOcrV1Response,
  AadhaarOcrV2Request,
  AadhaarOcrV2Response,
  FetchEAadhaarRequest,
  FetchEAadhaarResponse,
  AadhaarV2GenerateOtpRequest,
  AadhaarV2GenerateOtpResponse,
  AadhaarV2SubmitOtpRequest,
  AadhaarV2SubmitOtpResponse,
} from "../../types/kyc"

class AadhaarApi extends BaseApi {
  async ocrV1(data: AadhaarOcrV1Request): Promise<AadhaarOcrV1Response> {
    return this.post("/aadhaar/ocr-v1", data)
  }
  async ocrV2(data: FormData): Promise<AadhaarOcrV2Response> {
    return this.post("/aadhaar/ocr-v2", data, { headers: { "Content-Type": "multipart/form-data" } })
  }
  async fetchEAadhaar(data: FetchEAadhaarRequest): Promise<FetchEAadhaarResponse> {
    return this.post("/aadhaar/fetch-eaadhaar", data)
  }
  
  // QuickEKYC Aadhaar V2 Methods
  async generateOtpV2(data: AadhaarV2GenerateOtpRequest): Promise<AadhaarV2GenerateOtpResponse> {
    return this.post("/aadhaar/v2/generate-otp", data)
  }
  
  async submitOtpV2(data: AadhaarV2SubmitOtpRequest): Promise<AadhaarV2SubmitOtpResponse> {
    return this.post("/aadhaar/v2/submit-otp", data)
  }
}

export const aadhaarApi = new AadhaarApi("/api") 