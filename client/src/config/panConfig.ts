import type {
  PanFatherNameRequest,
  PanAadhaarLinkRequest,
  DigilockerInitRequest,
  PanDigilockerPullRequest,
  DigilockerFetchDocumentRequest
} from "../types/kyc"
import { CreditCard, FileText } from "lucide-react"

export type PanServiceKey =
  | "father-name"
  | "fetch-advanced"
  | "aadhaar-link"
  | "digilocker-init"
  | "digilocker-pull"
  | "digilocker-fetch-document"
  | "gstin-by-pan"
  | "din-by-pan"
  | "cin-by-pan"
  | "fetch-detailed"

export interface PanServiceMeta {
  key: PanServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: keyof PanFatherNameRequest | keyof PanAadhaarLinkRequest | keyof DigilockerInitRequest | keyof PanDigilockerPullRequest | keyof DigilockerFetchDocumentRequest | string
    label: string
    type: "text" | "json" | "radio"
    required: boolean
    options?: { label: string; value: string }[]
    placeholder?: string
  }[]
  icon?: React.ElementType
}

export const DIGILOCKER_REDIRECT_URI = `${window.location.origin}/pan?service=digilocker-pull`

export const panServices: PanServiceMeta[] = [
  {
    key: "fetch-detailed",
    name: "Fetch PAN Detailed",
    description: "Fetch detailed PAN information including holder's name, DOB, and status.",
    apiEndpoint: "/pan/fetch-pan-detailed",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ],
    icon: CreditCard,
  },
  {
    key: "father-name",
    name: "Fetch Father's Name by PAN",
    description: "Get the father's name associated with a PAN number.",
    apiEndpoint: "/pan/father-name",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ],
    icon: CreditCard,
  },
  {
    key: "gstin-by-pan",
    name: "Fetch GSTIN by PAN",
    description: "Fetch all GSTINs associated with a PAN.",
    // Route via PAN module to consume PAN quota first (fallback to company if needed)
    apiEndpoint: "/pan/gstin-by-pan",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "text", required: true, placeholder: "Type Y to consent" },
    ],
    icon: FileText,
  },
  {
    key: "din-by-pan",
    name: "Fetch DIN by PAN",
    description: "Fetch Director Identification Numbers linked to a PAN.",
    // Route via PAN module to consume PAN quota first (fallback to company if needed)
    apiEndpoint: "/pan/din-by-pan",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "text", required: true, placeholder: "Type Y to consent" },
    ],
    icon: FileText,
  },
  {
    key: "cin-by-pan",
    name: "Fetch CIN by PAN",
    description: "Fetch Company Identification Numbers linked to a PAN.",
    // Route via PAN module to consume PAN quota first (fallback to company if needed)
    apiEndpoint: "/pan/cin-by-pan",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ],
    icon: FileText,
  },
] 