import BaseApi from "./baseApi"
import type { AxiosRequestConfig } from "axios"
import type { GstinContactRequest, GstinContactResponse, GstinLiteRequest, GstinLiteResponse } from "../../types/kyc"

class BusinessApi extends BaseApi {
    // ---------------------------------------------------------------------------
    // GSTIN Services
    // ---------------------------------------------------------------------------
    async gstinContact(data: GstinContactRequest): Promise<GstinContactResponse> {
        return this.post("/gstin/fetch-contact", data)
    }
    async gstinFetchLite(data: GstinLiteRequest): Promise<GstinLiteResponse> {
        return this.post("/gstin/fetch-lite", data)
    }

    // ---------------------------------------------------------------------------
    // MCA Services
    // ---------------------------------------------------------------------------
    async mcaFetchCompany(data: unknown): Promise<unknown> {
        return this.post("/mca/fetch-company", data)
    }

    // ---------------------------------------------------------------------------
    // EPFO Services
    // ---------------------------------------------------------------------------
    // Fetch UAN by mobile and optional PAN
    async epfoFetchUan(data: { mobile_number: string; pan?: string; consent: string }): Promise<unknown> {
        return this.post("/epfo/fetch-uan", data)
    }
    // Employment history
    async epfoEmploymentByUan(data: { uan_number: string; consent: string }): Promise<unknown> {
        return this.post("/epfo/employment-history/fetch-by-uan", data)
    }
    async epfoEmploymentLatest(data: { uan: string; consent: string }): Promise<unknown> {
        return this.post("/epfo/employment-history/fetch-latest", data)
    }
    // UAN by PAN
    async epfoUanByPan(data: { pan_number: string; consent: string }): Promise<unknown> {
        return this.post("/epfo/uan/fetch-by-pan", data)
    }

    async epfoClaimStatus(data: { uan: string; consent: string }): Promise<unknown> {
        return this.post("/epfo/claim-status", data)
    }

    async epfoKycStatus(data: { uan: string; consent: string }): Promise<unknown> {
        return this.post("/epfo/kyc-status", data)
    }

    // Expose a public post method for generic use
    public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return super.post<T>(url, data, config)
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return super.get<T>(url, config)
    }
}

export const businessApi = new BusinessApi("/api")
