import type { AadhaarOcrV1Request, AadhaarOcrV2Request, FetchEAadhaarRequest } from "../types/kyc"
import { Camera, Upload, Download } from "lucide-react"

export type AadhaarServiceKey = "ocr-v1" | "ocr-v2" | "fetch-eaadhaar"

export interface AadhaarServiceMeta {
  key: AadhaarServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: keyof AadhaarOcrV1Request | keyof AadhaarOcrV2Request | keyof FetchEAadhaarRequest
    label: string
    type: "text" | "file" | "json"
    required: boolean
  }[]
  icon?: React.ElementType
}

export const aadhaarServices: AadhaarServiceMeta[] = [
  // {
  //   key: "ocr-v1",
  //   name: "Aadhaar OCR (Base64)",
  //   description: "Extract data from Aadhaar image (base64)",
  //   apiEndpoint: "/api/aadhaar/ocr-v1",
  //   formFields: [
  //     { name: "base64_data", label: "Aadhaar Image (Base64)", type: "text", required: true },
  //     { name: "consent", label: "Consent", type: "text", required: true },
  //   ],
  //   icon: Camera,
  // },
  {
    key: "ocr-v2",
    name: "Aadhaar OCR (File Upload)",
    description: "Extract data from Aadhaar image (file upload)",
    apiEndpoint: "/api/aadhaar/ocr-v2",
    formFields: [
      { name: "file_front", label: "Aadhaar Front Image", type: "file", required: true },
      { name: "file_back", label: "Aadhaar Back Image", type: "file", required: false },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: Upload,
  },
  // {
  //   key: "fetch-eaadhaar",
  //   name: "Fetch eAadhaar",
  //   description: "Fetch eAadhaar using transaction ID and JSON payload",
  //   apiEndpoint: "/api/aadhaar/fetch-eaadhaar",
  //   formFields: [
  //     { name: "transaction_id", label: "Transaction ID", type: "text", required: true },
  //     { name: "json", label: "JSON Payload", type: "json", required: true },
  //   ],
  //   icon: Download,
  // },
] 