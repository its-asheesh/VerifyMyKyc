import type {
  PassportGenerateMrzRequest,
  PassportVerifyMrzRequest,
  PassportVerifyRequest,
  PassportFetchRequest,
  PassportOcrRequest,
} from '../types/kyc'
import { Search, User } from "lucide-react"

export type PassportServiceKey =
  | 'mrz-generate'
  | 'mrz-verify'
  | 'verify'
  | 'fetch'
  | 'ocr'

export interface PassportServiceMeta {
  key: PassportServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: keyof PassportGenerateMrzRequest
    | keyof PassportVerifyMrzRequest
    | keyof PassportVerifyRequest
    | keyof PassportFetchRequest
    | keyof PassportOcrRequest
    | string
    label: string
    type: 'text' | 'radio' | 'textarea' | 'file'
    required: boolean
    options?: { label: string; value: string }[]
    placeholder?: string
    helpText?: string
  }[]
  icon?: React.ElementType
  category: 'identity' | 'verification' | 'document'
}

export const passportServices: PassportServiceMeta[] = [
  {
    key: 'fetch',
    name: 'Fetch Passport Details',
    description: 'Retrieve passport information using file number and date of birth.',
    apiEndpoint: '/passport/fetch',
    category: 'document',
    formFields: [
      { name: 'file_number', label: 'File Number', type: 'text', required: true, placeholder: 'Enter File Number' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
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
    key: 'verify',
    name: 'Verify Passport',
    description: 'Verify passport details against government database.',
    apiEndpoint: '/passport/verify',
    category: 'verification',
    formFields: [
      { name: 'file_number', label: 'File Number', type: 'text', required: true, placeholder: 'Enter File Number' },
      { name: 'passport_number', label: 'Passport Number', type: 'text', required: true, placeholder: 'Enter Passport Number' },
      { name: 'surname', label: 'Surname', type: 'text', required: true, placeholder: 'Enter Surname' },
      { name: 'given_name', label: 'Given Name(s)', type: 'text', required: true, placeholder: 'Enter Given Name' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
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
    icon: User,
  },
]