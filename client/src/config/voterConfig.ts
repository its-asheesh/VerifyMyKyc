import { Shield } from "lucide-react"

export type VoterServiceKey = "boson-fetch" | "meson-fetch" | "ocr"

export interface VoterServiceMeta {
  key: VoterServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: string
    label: string
    type: "text" | "file" | "json"
    required: boolean
    placeholder?: string
  }[]
  icon?: React.ElementType
}

export const voterServices: VoterServiceMeta[] = [
  {
    key: "boson-fetch",
    name: "Direct Fetch",
    description: "Fetch voter details directly using Voter ID",
    apiEndpoint: "/api/voter/boson/fetch",
    formFields: [
      { name: "voter_id", label: "Enter voter ID number/EPIC No.", type: "text", required: true, placeholder: "Example: ABC9999999" },
      { name: "consent", label: "Consent", type: "text", required: true, placeholder: "Type Y to consent" },
    ],
    icon: Shield,
  },
]
