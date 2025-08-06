import type {
  PanFatherNameRequest,
  PanAadhaarLinkRequest,
  DigilockerInitRequest,
  PanDigilockerPullRequest,
  DigilockerFetchDocumentRequest
} from "../types/kyc"
import { CreditCard, Link, Download, FileText } from "lucide-react"

export type PanServiceKey = "father-name" | "aadhaar-link" | "digilocker-init" | "digilocker-pull" | "digilocker-fetch-document"

export interface PanServiceMeta {
  key: PanServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: keyof PanFatherNameRequest | keyof PanAadhaarLinkRequest | keyof DigilockerInitRequest | keyof PanDigilockerPullRequest | keyof DigilockerFetchDocumentRequest | string
    label: string
    type: "text" | "json"
    required: boolean
  }[]
  icon?: React.ElementType
}

export const DIGILOCKER_REDIRECT_URI = "http://localhost:5173/pan?service=digilocker-pull"

export const panServices: PanServiceMeta[] = [
  {
    key: "father-name",
    name: "Fetch Father's Name by PAN",
    description: "Get the father's name associated with a PAN number.",
    apiEndpoint: "/api/pan/father-name",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: CreditCard,
  },
  {
    key: "aadhaar-link",
    name: "Check PAN-Aadhaar Link",
    description: "Check if a PAN is linked to an Aadhaar number.",
    apiEndpoint: "/api/pan/aadhaar-link",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true },
      { name: "aadhaar_number", label: "Aadhaar Number", type: "text", required: true },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: Link,
  },
  // {
  //   key: "digilocker-init",
  //   name: "Digilocker Init",
  //   description: "Initiate Digilocker flow for PAN.",
  //   apiEndpoint: "/api/pan/digilocker-init",
  //   formFields: [
  //     { name: "redirect_uri", label: "Redirect URI", type: "text", required: true },
  //     { name: "consent", label: "Consent", type: "text", required: true },
  //   ],
  // },
  {
    key: "digilocker-pull",
    name: "Digilocker Pull PAN",
    description: "Pull PAN document from Digilocker.",
    apiEndpoint: "/api/pan/digilocker-pull",
    formFields: [
      { name: "panno", label: "PAN Number", type: "text", required: true },
      { name: "PANFullName", label: "PAN Full Name", type: "text", required: true },
      // transactionId will be auto-filled after Digilocker consent
    ],
    icon: Download,
  },
  {
    key: "digilocker-fetch-document",
    name: "Digilocker Fetch Document",
    description: "Fetch PAN document from Digilocker using document URI.",
    apiEndpoint: "/api/pan/digilocker-fetch-document",
    formFields: [
      { name: "document_uri", label: "Document URI", type: "text", required: true },
      { name: "transaction_id", label: "Transaction ID", type: "text", required: true },
    ],
    icon: FileText,
  },
] 