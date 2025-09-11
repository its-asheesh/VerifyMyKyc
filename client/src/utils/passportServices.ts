import type {
  PassportGenerateMrzRequest,
  PassportVerifyMrzRequest,
  PassportVerifyRequest,
  PassportFetchRequest,
  PassportOcrRequest,
} from '../types/kyc'
import { FileText, User, Shield, Scan, AlertTriangle, Search } from 'lucide-react'

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
    key: 'mrz-generate',
    name: 'Generate MRZ',
    description: 'Create Machine Readable Zone (MRZ) from passport details.',
    apiEndpoint: '/passport/mrz/generate',
    category: 'document',
    formFields: [
      { name: 'country_code', label: 'Country Code', type: 'text', required: true, placeholder: 'e.g., IND' },
      { name: 'passport_number', label: 'Passport Number', type: 'text', required: true },
      { name: 'surname', label: 'Surname', type: 'text', required: true },
      { name: 'given_name', label: 'Given Name(s)', type: 'text', required: true },
      { name: 'gender', label: 'Gender', type: 'text', required: true, placeholder: 'MALE/FEMALE' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
      { name: 'date_of_expiry', label: 'Expiry Date', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
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
    key: 'mrz-verify',
    name: 'Verify MRZ',
    description: 'Validate if MRZ matches provided passport details.',
    apiEndpoint: '/passport/mrz/verify',
    category: 'verification',
    formFields: [
      { name: 'country_code', label: 'Country Code', type: 'text', required: true, placeholder: 'e.g., IND' },
      { name: 'passport_number', label: 'Passport Number', type: 'text', required: true },
      { name: 'surname', label: 'Surname', type: 'text', required: true },
      { name: 'given_name', label: 'Given Name(s)', type: 'text', required: true },
      { name: 'gender', label: 'Gender', type: 'text', required: true, placeholder: 'MALE/FEMALE' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
      { name: 'date_of_expiry', label: 'Expiry Date', type: 'text', required: true, placeholder: 'YYYY-MM-DD' },
      { name: 'mrz_first_line', label: 'MRZ First Line', type: 'text', required: true },
      { name: 'mrz_second_line', label: 'MRZ Second Line', type: 'text', required: true },
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
    icon: Shield,
  },
  {
    key: 'verify',
    name: 'Verify Passport',
    description: 'Verify passport details against government database.',
    apiEndpoint: '/passport/verify',
    category: 'verification',
    formFields: [
      { name: 'file_number', label: 'File Number', type: 'text', required: true },
      { name: 'passport_number', label: 'Passport Number', type: 'text', required: true },
      { name: 'surname', label: 'Surname', type: 'text', required: true },
      { name: 'given_name', label: 'Given Name(s)', type: 'text', required: true },
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
  {
    key: 'fetch',
    name: 'Fetch Passport Details',
    description: 'Retrieve passport information using file number and date of birth.',
    apiEndpoint: '/passport/fetch',
    category: 'document',
    formFields: [
      { name: 'file_number', label: 'File Number', type: 'text', required: true },
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
  // {
  //   key: 'ocr',
  //   name: 'Passport OCR',
  //   description: 'Extract data from passport images using Optical Character Recognition.',
  //   apiEndpoint: '/passport/ocr',
  //   category: 'document',
  //   formFields: [
  //     { name: 'file_front', label: 'Passport Front Image', type: 'file', required: true },
  //     { name: 'file_back', label: 'Passport Back Image', type: 'file', required: false },
  //     {
  //       name: 'consent',
  //       label: 'Consent',
  //       type: 'radio',
  //       required: true,
  //       options: [
  //         { label: 'Yes', value: 'Y' },
  //         { label: 'No', value: 'N' },
  //       ],
  //     },
  //   ],
  //   icon: Scan,
  // },
]