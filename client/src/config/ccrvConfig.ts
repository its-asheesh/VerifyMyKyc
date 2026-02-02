import type {
  CCRVGenerateReportRequest,
  CCRVSearchRequest,
  CCRVFetchResultRequest,
} from '../types/kyc';
import { FileText, Search } from 'lucide-react';

export type CCRVServiceKey =
  | 'generate-report'
  | 'search';

export interface CCRVServiceMeta {
  key: CCRVServiceKey;
  name: string;
  description: string;
  apiEndpoint: string;
  formFields: {
    name: keyof CCRVGenerateReportRequest 
      | keyof CCRVSearchRequest 
      | keyof CCRVFetchResultRequest
      | string;
    label: string;
    type: 'text' | 'radio' | 'file' | 'select';
    required: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
    helpText?: string;
  }[];
  icon?: React.ElementType;
  category: 'identity' | 'verification' | 'document';
}

export const ccrvServices: CCRVServiceMeta[] = [
  {
    key: 'generate-report',
    name: 'Generate CCRV Report',
    description: 'Initiate a comprehensive criminal case record verification report.',
    apiEndpoint: '/ccrv/generate-report',
    category: 'verification',
    formFields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name', helpText: 'Name should be alpha-numeric with a maximum character limit of 256.' },
      { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter complete address', helpText: 'Address should have a maximum character limit of 512.' },
      { name: 'father_name', label: "Father's Name", type: 'text', required: false, placeholder: "Enter father's name", helpText: 'Father name should be alpha-numeric with a maximum character limit of 256.' },
      { name: 'additional_address', label: 'Additional Address', type: 'text', required: false, placeholder: 'Enter additional address', helpText: 'Additional address should have a maximum character limit of 512.' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: false, placeholder: 'YYYY-MM-DD', helpText: 'Format for date of birth: yyyy-mm-dd' },
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
    key: 'search',
    name: 'Search CCRV Records',
    description: 'Search for criminal case records based on name, address, and other criteria.',
    apiEndpoint: '/ccrv/search',
    category: 'verification',
    formFields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'address', label: 'Address', type: 'text', required: true, placeholder: 'Enter complete address' },
      { name: 'father_name', label: "Father's Name", type: 'text', required: false, placeholder: "Enter father's name" },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: false, placeholder: 'YYYY-MM-DD' },
      { 
        name: 'case_category', 
        label: 'Case Category', 
        type: 'select',
        required: false,
        options: [
          { label: 'Criminal', value: 'CRIMINAL' },
          { label: 'Civil', value: 'CIVIL' },
        ],
        placeholder: 'Select case category'
      },
      { 
        name: 'type', 
        label: 'Individual Type', 
        type: 'select',
        required: false,
        options: [
          { label: 'Petitioner', value: 'PETITIONER' },
          { label: 'Respondent', value: 'RESPONDENT' },
        ],
        placeholder: 'Select individual type'
      },
      { 
        name: 'name_match_type', 
        label: 'Name Match Type', 
        type: 'select',
        required: false,
        options: [
          { label: 'Exact Match', value: 'EXACT_MATCH' },
          { label: 'Exact & Fuzzy', value: 'EXACT_FUZZY' },
          { label: 'Partial Exact', value: 'PARTIAL_EXACT' },
          { label: 'Partial Fuzzy', value: 'PARTIAL_FUZZY' },
          { label: 'No Match', value: 'NO_MATCH' },
        ],
        placeholder: 'Select name match type'
      },
      { 
        name: 'father_match_type', 
        label: 'Father Match Type', 
        type: 'select',
        required: false,
        options: [
          { label: 'Exact Match', value: 'EXACT_MATCH' },
          { label: 'Exact & Fuzzy', value: 'EXACT_FUZZY' },
          { label: 'Partial Exact', value: 'PARTIAL_EXACT' },
          { label: 'Partial Fuzzy', value: 'PARTIAL_FUZZY' },
          { label: 'No Match', value: 'NO_MATCH' },
        ],
        placeholder: 'Select father match type'
      },
      { 
        name: 'jurisdiction_type', 
        label: 'Jurisdiction Type', 
        type: 'select',
        required: false,
        options: [
          { label: 'State', value: 'STATE' },
          { label: 'District', value: 'DISTRICT' },
          { label: 'Nearest Districts', value: 'NEAREST_DISTRICTS' },
          { label: 'Pan India', value: 'PAN_INDIA' },
        ],
        placeholder: 'Select jurisdiction type'
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
    icon: Search,
  },
];