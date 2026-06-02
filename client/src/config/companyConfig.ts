import { Building } from "lucide-react"
import type { ElementType } from "react"

export type CompanyServiceKey = "fetch-company"

export interface CompanyServiceMeta {
  key: CompanyServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: string
    label: string
    type: "text" | "json"
    required: boolean
    placeholder?: string
  }[]
  icon?: ElementType
}

export const companyServices: CompanyServiceMeta[] = [
  {
    key: "fetch-company",
    name: "Fetch Company by ID",
    description: "Fetch company details by CIN, FCRN, or LLPIN (company_id).",
    apiEndpoint: "/mca/fetch-company",
    formFields: [
      { name: "company_id", label: "Company ID (CIN/FCRN/LLPIN)", type: "text", required: true, placeholder: "Enter CIN / FCRN / LLPIN" },
      { name: "consent", label: "Consent", type: "text", required: true, placeholder: "Type Y to consent" },
    ],
    icon: Building,
  },
]
