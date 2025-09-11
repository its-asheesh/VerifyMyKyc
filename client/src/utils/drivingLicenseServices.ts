import { CreditCard, FileText } from "lucide-react"

export type DrivingLicenseServiceKey = "ocr" | "fetch-details"

export interface DrivingLicenseServiceMeta {
  key: DrivingLicenseServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: string
    label: string
    type: "text" | "file"
    required: boolean
  }[]
  icon?: React.ElementType
}

export const drivingLicenseServices: DrivingLicenseServiceMeta[] = [
  // {
  //   key: "ocr",
  //   name: "Driving License OCR",
  //   description: "Extract data from Driving License image(s)",
  //   apiEndpoint: "/api/drivinglicense/ocr",
  //   formFields: [
  //     { name: "file_front", label: "DL Front Image", type: "file", required: true },
  //     { name: "file_back", label: "DL Back Image", type: "file", required: false },
  //     { name: "consent", label: "Consent", type: "text", required: true },
  //   ],
  //   icon: CreditCard,
  // },
  {
    key: "fetch-details",
    name: "Fetch Driving License Details",
    description: "Fetch driving license details from RTA database",
    apiEndpoint: "/api/drivinglicense/fetch-details",
    formFields: [
      { name: "driving_license_number", label: "Driving License Number", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth (yyyy-mm-dd)", type: "text", required: true },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: FileText,
  },
] 