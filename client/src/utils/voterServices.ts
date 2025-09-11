import { Upload, Shield, Image } from "lucide-react"

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
      { name: "voter_id", label: "Voter ID", type: "text", required: true },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: Shield,
  },
  // {
  //   key: "meson-fetch",
  //   name: "Captcha Fetch (Meson)",
  //   description: "Fetch voter details using captcha and transaction",
  //   apiEndpoint: "/api/voter/meson/fetch",
  //   formFields: [
  //     { name: "voter_id", label: "Voter ID", type: "text", required: true },
  //     { name: "captcha", label: "Captcha", type: "text", required: true },
  //     { name: "consent", label: "Consent", type: "text", required: true },
  //   ],
  //   icon: Image,
  // },
  // {
  //   key: "ocr",
  //   name: "Voter ID OCR (File Upload)",
  //   description: "Extract details from Voter ID image via OCR",
  //   apiEndpoint: "/api/voter/ocr",
  //   formFields: [
  //     { name: "file_front", label: "Voter ID Front Image", type: "file", required: true },
  //     { name: "file_back", label: "Voter ID Back Image", type: "file", required: false },
  //     { name: "consent", label: "Consent", type: "text", required: true },
  //   ],
  //   icon: Upload,
  // },
]
