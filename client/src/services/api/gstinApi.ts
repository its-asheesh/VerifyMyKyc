import BaseApi from "./baseApi"
import type { GstinContactRequest, GstinContactResponse, GstinLiteRequest, GstinLiteResponse } from "../../types/kyc"

class GstinApi extends BaseApi {
  async contact(data: GstinContactRequest): Promise<GstinContactResponse> {
    return this.post("/gstin/fetch-contact", data)
  }
  async fetchLite(data: GstinLiteRequest): Promise<GstinLiteResponse> {
    return this.post("/gstin/fetch-lite", data)
  }
  // Expose a public post method for generic use
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config)
  }
}

export const gstinApi = new GstinApi("/api")
