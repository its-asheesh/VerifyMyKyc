import { FileText } from "lucide-react";

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
    placeholder?: string
  }[]
  icon?: React.ElementType
}

export const drivingLicenseServices: DrivingLicenseServiceMeta[] = [
  {
    key: "fetch-details",
    name: "Fetch Driving License Details",
    description: "Fetch driving license details from RTA database",
    apiEndpoint: "/api/drivinglicense/fetch-details",
    formFields: [
      { name: "driving_license_number", label: "Driving License Number", type: "text", required: true, placeholder: "Enter driving license number" },
      { name: "date_of_birth", label: "Date of Birth (yyyy-mm-dd)", type: "text", required: true, placeholder: "YYYY-MM-DD" },
      { name: "consent", label: "Consent", type: "text", required: true, placeholder: "Type Y to consent" },
    ],
    icon: FileText,
  },
] 