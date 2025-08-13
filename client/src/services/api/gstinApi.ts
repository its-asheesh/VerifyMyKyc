import BaseApi from "./baseApi"
import type {
  GstinContactRequest,
  GstinContactResponse,
  GstinLiteRequest,
  GstinBaseResponse
} from "../../types/kyc"

// Using Vite's environment variables (prefixed with VITE_)
const GRIDLINES_API_BASE = import.meta.env.VITE_GRIDLINES_API_BASE || 'https://api.gridlines.io';
const GRIDLINES_API_KEY = import.meta.env.VITE_GRIDLINES_API_KEY || '';

class GstinApi extends BaseApi {
  // Existing contact details endpoint
  async fetchContact(data: GstinContactRequest): Promise<GstinContactResponse> {
    return this.post<GstinContactResponse>("/gstin/fetch-contact", data)
  }

  // New GSTIN Lite endpoint
  async fetchLite(data: GstinLiteRequest): Promise<GstinBaseResponse> {
    try {
      const response = await fetch(`${GRIDLINES_API_BASE}/gstin-api/fetch-lite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': GRIDLINES_API_KEY,
          'X-Auth-Type': 'API-Key'
        },
        body: JSON.stringify({
          gstin: data.gstin,
          include_hsn_data: data.include_hsn_data || false,
          include_filing_data: data.include_filing_data || false,
          include_filing_frequency: data.include_filing_frequency || false,
          consent: data.consent
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result as GstinBaseResponse;
    } catch (error) {
      console.error('Error in GSTIN Lite API:', error);
      throw error;
    }
  }
}

export const gstinApi = new GstinApi("/api");
