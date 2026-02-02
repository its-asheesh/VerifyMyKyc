import type {
  RcFetchLiteRequest,
  RcFetchDetailedRequest,
  RcFetchDetailedChallanRequest,
  RcEchallanFetchRequest,
  RcFetchRegNumByChassisRequest,
  RcFastagFetchRequest,
} from '../types/kyc'
import { Search, FileText, AlertTriangle, IndianRupee } from "lucide-react"

export type RcServiceKey =
  | 'fetch-lite'
  | 'fetch-detailed'
  | 'fetch-detailed-challan'
  | 'echallan-fetch'
  | 'fetch-reg-num-by-chassis'
  | 'fastag-fetch-detailed'

export interface RcServiceMeta {
  key: RcServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: keyof RcFetchLiteRequest
    | keyof RcFetchDetailedRequest
    | keyof RcFetchDetailedChallanRequest
    | keyof RcEchallanFetchRequest
    | keyof RcFetchRegNumByChassisRequest
    | keyof RcFastagFetchRequest
    | string
    label: string
    type: 'text' | 'radio' | 'json' | 'select'
    required: boolean
    options?: { label: string; value: string }[]
    placeholder?: string
  }[]
  icon?: React.ElementType
}

export const rcServices: RcServiceMeta[] = [
  {
    key: 'fetch-lite',
    name: 'Fetch RC Lite',
    description: 'Get basic RC details like owner name, expiry date, and vehicle info.',
    apiEndpoint: '/vehicle/rc/fetch-lite',
    formFields: [
      { name: 'rc_number', label: 'RC Number', type: 'text', required: true, placeholder: 'Enter RC Number (e.g. MH01AB1234)' },
      {
        name: 'consent',
        label: 'Consent',
        type: 'radio',
        required: true,
        options: [
          { label: 'Yes', value: 'Y' },
          { label: 'No', value: 'N' },
        ],
      },
    ],
    icon: FileText,
  },
  {
    key: 'echallan-fetch',
    name: 'Fetch E-Challan by RC & Engine',
    description: 'Fetch e-challans using RC number, chassis, and engine number. You can filter by date range and limit results.',
    apiEndpoint: '/vehicle/challan/fetch',
    formFields: [
      { name: 'rc_number', label: 'RC Number', type: 'text', required: true, placeholder: 'Enter RC Number' },
      { name: 'chassis_number', label: 'Chassis Number', type: 'text', required: true, placeholder: 'Enter Chassis Number' },
      { name: 'engine_number', label: 'Engine Number', type: 'text', required: true, placeholder: 'Enter Engine Number' },
      {
        name: 'state_portals',
        label: 'State Portals (CSV)',
        type: 'text',
        required: false,
        placeholder: 'e.g. WB, DL (Optional)'
      },
      {
        name: 'date_range',
        label: 'Date Range',
        type: 'select',
        required: false,
        options: [
          { label: 'All Time', value: 'all' },
          { label: 'Last 30 Days', value: '30' },
          { label: 'Last 90 Days', value: '90' },
          { label: 'Last 1 Year', value: '365' },
        ],
        placeholder: 'Select date range (optional)'
      },
      {
        name: 'limit',
        label: 'Max Challans to Fetch',
        type: 'select',
        required: false,
        options: [
          { label: 'All Challans', value: 'all' },
          { label: 'Latest 10', value: '10' },
          { label: 'Latest 20', value: '20' },
          { label: 'Latest 50', value: '50' },
        ],
        placeholder: 'Select limit (optional)'
      },
      {
        name: 'consent',
        label: 'Consent',
        type: 'radio',
        required: true,
        options: [
          { label: 'Yes', value: 'Y' },
          { label: 'No', value: 'N' },
        ],
      },
    ],
    icon: AlertTriangle,
  },
  {
    key: 'fetch-reg-num-by-chassis',
    name: 'Fetch Reg Number by Chassis',
    description: 'Retrieve vehicle registration number using chassis number.',
    apiEndpoint: '/vehicle/rc/fetch-reg-num-by-chassis',
    formFields: [
      { name: 'chassis_number', label: 'Chassis Number', type: 'text', required: true, placeholder: 'Enter Chassis Number' },
      {
        name: 'consent',
        label: 'Consent',
        type: 'radio',
        required: true,
        options: [
          { label: 'Yes', value: 'Y' },
          { label: 'No', value: 'N' },
        ],
      },
    ],
    icon: Search,
  },
  {
    key: 'fastag-fetch-detailed',
    name: 'Fetch FASTag Details',
    description: 'Get FASTag status and history using RC number or Tag ID.',
    apiEndpoint: '/vehicle/fastag/fetch-detailed',
    formFields: [
      { name: 'rc_number', label: 'RC Number (Optional)', type: 'text', required: false, placeholder: 'Enter RC Number' },
      { name: 'tag_id', label: 'Tag ID (Optional)', type: 'text', required: false, placeholder: 'Enter FASTag ID' },
      {
        name: 'consent',
        label: 'Consent',
        type: 'radio',
        required: true,
        options: [
          { label: 'Yes', value: 'Y' },
          { label: 'No', value: 'N' },
        ],
      },
    ],
    icon: IndianRupee,
  },
]