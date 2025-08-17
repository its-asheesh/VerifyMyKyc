import BaseApi from "./baseApi"
import type {
  PanFatherNameRequest,
  PanFatherNameResponse,
  PanAadhaarLinkRequest,
  PanAadhaarLinkResponse,
  DigilockerInitRequest,
  DigilockerInitResponse,
  PanDigilockerPullRequest,
  PanDigilockerPullResponse,
  DigilockerFetchDocumentRequest,
  DigilockerFetchDocumentResponse
} from "../../types/kyc"

class PanApi extends BaseApi {
  async fetchFatherName(data: PanFatherNameRequest): Promise<PanFatherNameResponse> {
    return this.post("/pan/father-name", data)
  }
  async checkAadhaarLink(data: PanAadhaarLinkRequest): Promise<PanAadhaarLinkResponse> {
    return this.post("/pan/aadhaar-link", data)
  }
  async digilockerInit(data: DigilockerInitRequest): Promise<DigilockerInitResponse> {
    return this.post("/pan/digilocker-init", data)
  }
  async digilockerPull(data: PanDigilockerPullRequest & { transactionId: string }): Promise<PanDigilockerPullResponse> {
    return this.post("/pan/digilocker-pull", data)
  }
  async digilockerFetchDocument(data: DigilockerFetchDocumentRequest): Promise<DigilockerFetchDocumentResponse> {
    return this.post("/pan/digilocker-fetch-document", data)
  }
  // GSTIN by PAN (GSTIN module)
  async fetchGstinByPan(data: any): Promise<any> {
    return this.post("/gstin/fetch-by-pan", data)
  }
  // DIN by PAN (MCA module)
  async fetchDinByPan(data: any): Promise<any> {
    return this.post("/mca/din-by-pan", data)
  }
  // CIN by PAN (MCA module)
  async fetchCinByPan(data: any): Promise<any> {
    return this.post("/mca/cin-by-pan", data)
  }
  // Expose a public post method for generic use
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config)
  }
}

export const panApi = new PanApi("/api") 