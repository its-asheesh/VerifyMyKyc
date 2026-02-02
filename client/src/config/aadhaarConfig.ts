import type { AadhaarOcrV1Request, AadhaarOcrV2Request, FetchEAadhaarRequest } from "../types/kyc"
import { FormInputIcon } from "lucide-react"

export type AadhaarServiceKey = "ocr-v1" | "ocr-v2" | "fetch-eaadhaar" | "v2-verify"

export interface AadhaarServiceMeta {
  key: AadhaarServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: keyof AadhaarOcrV1Request | keyof AadhaarOcrV2Request | keyof FetchEAadhaarRequest | "id_number"
    label: string
    type: "text" | "file" | "json"
    required: boolean
    placeholder?: string
  }[]
  icon?: React.ElementType
}

export const aadhaarServices: AadhaarServiceMeta[] = [
  {
    key: "v2-verify",
    name: "Aadhaar Verification (OTP)",
    description: "Verify Aadhaar using OTP sent to registered mobile number",
    apiEndpoint: "/api/aadhaar/v2/generate-otp",
    formFields: [
      { name: "id_number", label: "Aadhaar Number", type: "text", required: true, placeholder: "Enter 12-digit Aadhaar number" },
      { name: 'consent', label: 'Consent', type: 'text', required: true, placeholder: 'Type Y to consent' },
    ],
    icon: FormInputIcon,
  },
] 