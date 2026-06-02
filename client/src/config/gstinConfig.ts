import type { GstinContactRequest, GstinLiteRequest } from "../types/kyc"
import { FileText, Building } from "lucide-react"

export type GstinServiceKey = "contact" | "lite"

export interface GstinServiceMeta {
  key: GstinServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: Array<{
    name: keyof GstinContactRequest | keyof GstinLiteRequest | string
    label: string
    type: "text" | "radio"
    required: boolean
    options?: Array<{ label: string; value: string }>
    pattern?: string
    title?: string
    placeholder?: string
  }>
  icon?: React.ElementType
}

export const gstinServices: GstinServiceMeta[] = [
  {
    key: "lite",
    name: "GSTIN Verification",
    description: "Verify basic GSTIN details including business name, status, and registration information",
    apiEndpoint: "/gstin/fetch-lite",
    formFields: [
      {
        name: "gstin",
        label: "GSTIN Number",
        type: "text",
        required: true,
        placeholder: "Enter 15-digit GSTIN number",
        pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
        title: "Please enter a valid 15-digit GSTIN number"
      },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" }
        ]
      }
    ],
    icon: Building
  },
  {
    key: "contact",
    name: "GSTIN Contact Details",
    description: "Verify contact information for any business using their GSTIN number",
    apiEndpoint: "/gstin/fetch-contact",
    formFields: [
      {
        name: "gstin",
        label: "GSTIN Number",
        type: "text",
        required: true,
        placeholder: "Enter 15-digit GSTIN number",
        pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
        title: "Please enter a valid 15-digit GSTIN number"
      },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" }
        ]
      }
    ],
    icon: FileText
  },
  
]