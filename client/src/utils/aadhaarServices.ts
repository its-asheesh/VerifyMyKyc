import type { AadhaarOcrV1Request, AadhaarOcrV2Request, FetchEAadhaarRequest } from "../types/kyc"
import { Camera, Upload, Download , FormInputIcon } from "lucide-react"

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
      { name: "id_number", label: "Aadhaar Number", type: "text", required: true },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: FormInputIcon,
  },
  // {
  //   key: "ocr-v2",
  //   name: "Aadhaar OCR (File Upload)",
  //   description: "Extract data from Aadhaar image (file upload) - Legacy",
  //   apiEndpoint: "/api/aadhaar/ocr-v2",
  //   formFields: [
  //     { name: "file_front", label: "Aadhaar Front Image", type: "file", required: true },
  //     { name: "file_back", label: "Aadhaar Back Image", type: "file", required: false },
  //     { name: "consent", label: "Consent", type: "text", required: true },
  //   ],
  //   icon: Upload,
  // },
] 