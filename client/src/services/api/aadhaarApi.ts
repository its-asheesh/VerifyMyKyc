import BaseApi from "./baseApi"
import type {
  AadhaarOcrV1Request,
  AadhaarOcrV1Response,
  AadhaarOcrV2Request,
  AadhaarOcrV2Response,
  FetchEAadhaarRequest,
  FetchEAadhaarResponse,
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
}

export const aadhaarApi = new AadhaarApi("/api") 