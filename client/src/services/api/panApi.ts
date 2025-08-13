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
  DigilockerFetchDocumentResponse,
  GstinByPanRequest,
  GstinByPanResponse
} from "../../types/kyc"

// Add CIN by PAN types
interface CinByPanRequest {
  pan_number: string
  consent: string
}

interface CinByPanResponse {
  request_id: string
  transaction_id: string
  reference_id: string
  status: number
  data: {
    code: string
    message: string
    cin_list: string[]
    cin_details: Array<{
      cin: string
      entity_name: string
    }>
  }
  timestamp: number
  path: string
}

// Add DIN by PAN types
interface DinByPanRequest {
  pan_number: string
  consent: string
}

interface DinByPanResponse {
  request_id: string
  transaction_id: string
  reference_id: string
  status: number
  data: {
    code: string
    message: string
    din_details?: {
      pan: string
      name: string
      din: string
    }
  }
  timestamp: number
  path: string
}

class PanApi extends BaseApi {
  async fetchFatherName(data: PanFatherNameRequest): Promise<PanFatherNameResponse> {
    return this.post("/pan/father-name", data)
  }
  async checkAadhaarLink(data: PanAadhaarLinkRequest): Promise<PanAadhaarLinkResponse> {
    return this.post("/pan/aadhaar-link", data)
  }
  async fetchCinByPan(data: CinByPanRequest): Promise<CinByPanResponse> {
    return this.post("/mca/cin-by-pan", data)
  }
  async fetchDinByPan(data: DinByPanRequest): Promise<DinByPanResponse> {
    return this.post("/mca/din-by-pan", data)
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
  async fetchGstinByPan(data: GstinByPanRequest): Promise<GstinByPanResponse> {
    return this.post("/gstin/fetch-by-pan", data)
  }
  // Expose a public post method for generic use
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config)
  }
}

export const panApi = new PanApi("/api") 