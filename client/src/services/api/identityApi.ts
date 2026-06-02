import BaseApi from "./baseApi"
import type { AxiosRequestConfig } from "axios"
import type {
    PanFatherNameRequest,
    PanFatherNameResponse,
    FetchPanDetailedRequest,
    FetchPanDetailedResponse,
    AadhaarV2GenerateOtpRequest,
    AadhaarV2GenerateOtpResponse,
    AadhaarV2SubmitOtpRequest,
    AadhaarV2SubmitOtpResponse,
    PassportVerifyRequest,
    PassportVerifyResponse,
    PassportFetchRequest,
    PassportFetchResponse
} from "../../types/kyc"

// Voter Types
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
        voter_data?: unknown
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

export type VoterMesonFetchResponse = VoterBosonFetchResponse

export interface VoterOcrResponse {
    request_id: string
    transaction_id?: string
    status: number
    data: {
        code: string
        message: string
        ocr_data?: unknown
    }
    timestamp: number
    path: string
}

// Driving License Types
export interface DrivingLicenseOcrRequest {
    file_front: File;
    file_back?: File;
    consent: string;
}

export interface DrivingLicenseOcrResponse {
    data: unknown;
}

export interface DrivingLicenseFetchDetailsRequest {
    driving_license_number: string;
    date_of_birth: string;
    consent: string;
}

export interface DrivingLicenseFetchDetailsResponse {
    data: unknown;
}

class IdentityApi extends BaseApi {
    // ---------------------------------------------------------------------------
    // PAN Services
    // ---------------------------------------------------------------------------
    async fetchPanFatherName(data: PanFatherNameRequest): Promise<PanFatherNameResponse> {
        return this.post("/pan/father-name", data)
    }
    // GSTIN by PAN (GSTIN module)
    async fetchGstinByPan(data: unknown): Promise<unknown> {
        return this.post("/pan/gstin-by-pan", data)
    }
    // DIN by PAN (MCA module)
    async fetchDinByPan(data: unknown): Promise<unknown> {
        return this.post("/pan/din-by-pan", data)
    }
    // CIN by PAN (MCA module)
    async fetchCinByPan(data: unknown): Promise<unknown> {
        return this.post("/pan/cin-by-pan", data)
    }
    // Fetch PAN Detailed
    async fetchPanDetailed(data: FetchPanDetailedRequest): Promise<FetchPanDetailedResponse> {
        return this.post("/pan/fetch-pan-detailed", data)
    }

    // ---------------------------------------------------------------------------
    // Aadhaar Services
    // ---------------------------------------------------------------------------
    // QuickEKYC Aadhaar V2 Methods
    async aadhaarGenerateOtpV2(data: AadhaarV2GenerateOtpRequest): Promise<AadhaarV2GenerateOtpResponse> {
        return this.post("/aadhaar/v2/generate-otp", data)
    }
    async aadhaarSubmitOtpV2(data: AadhaarV2SubmitOtpRequest): Promise<AadhaarV2SubmitOtpResponse> {
        return this.post("/aadhaar/v2/submit-otp", data)
    }

    // ---------------------------------------------------------------------------
    // Voter ID Services
    // ---------------------------------------------------------------------------
    async voterBosonFetch(data: VoterBosonFetchRequest): Promise<VoterBosonFetchResponse> {
        return this.post("/voter/boson/fetch", data)
    }

    // ---------------------------------------------------------------------------
    // Passport Services
    // ---------------------------------------------------------------------------
    async passportVerify(data: PassportVerifyRequest): Promise<PassportVerifyResponse> {
        return this.post('/passport/verify', data);
    }
    async fetchPassportDetails(data: PassportFetchRequest): Promise<PassportFetchResponse> {
        return this.post('/passport/fetch', data);
    }

    // ---------------------------------------------------------------------------
    // Driving License Services
    // ---------------------------------------------------------------------------
    async fetchDlDetails(data: DrivingLicenseFetchDetailsRequest): Promise<DrivingLicenseFetchDetailsResponse> {
        return this.post("/drivinglicense/fetch-details", data)
    }

    // Expose a public post method for generic use
    public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return super.post<T>(url, data, config)
    }
}

export const identityApi = new IdentityApi("/api")
