import BaseApi from "./baseApi"

export interface VoterBosonFetchRequest {
  voter_id: string
  consent: string // 'Y' | 'N'
}

export interface VoterBosonFetchResponse {
  request_id: string
  transaction_id?: string
  reference_id?: string
  status: number
  data: {
    code: string
    message: string
    voter_data?: any
  }
  timestamp: number
  path: string
}

export interface VoterMesonInitResponse {
  request_id: string
  transaction_id: string
  status: number
  data: {
    code: string
    transaction_id: string
    message: string
    captcha_base64: string
  }
  timestamp: number
  path: string
}

export interface VoterMesonFetchRequest {
  voter_id: string
  captcha: string
  transaction_id: string
  consent: string // 'Y' | 'N'
}

export interface VoterMesonFetchResponse extends VoterBosonFetchResponse {}

export interface VoterOcrResponse {
  request_id: string
  transaction_id?: string
  status: number
  data: {
    code: string
    message: string
    ocr_data?: any
  }
  timestamp: number
  path: string
}

class VoterApi extends BaseApi {
  async bosonFetch(data: VoterBosonFetchRequest): Promise<VoterBosonFetchResponse> {
    return this.post("/voter/boson/fetch", data)
  }
  async mesonInit(): Promise<VoterMesonInitResponse> {
    return this.get("/voter/meson/init")
  }
  async mesonFetch(data: VoterMesonFetchRequest): Promise<VoterMesonFetchResponse> {
    return this.post("/voter/meson/fetch", data)
  }
  async ocr(data: FormData): Promise<VoterOcrResponse> {
    return this.post("/voter/ocr", data, { headers: { "Content-Type": "multipart/form-data" } })
  }
}

export const voterApi = new VoterApi("/api")
