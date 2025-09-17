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
      { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
      { name: 'father_name', label: "Father's Name", type: 'text', required: false, placeholder: "Enter father's name" },
      { name: 'house_number', label: 'House Number', type: 'text', required: false, placeholder: 'Enter house number' },
      { name: 'locality', label: 'Locality', type: 'text', required: false, placeholder: 'Enter locality' },
      { name: 'city', label: 'City', type: 'text', required: false, placeholder: 'Enter city' },
      { name: 'village', label: 'Village', type: 'text', required: false, placeholder: 'Enter village' },
      { name: 'state', label: 'State', type: 'text', required: false, placeholder: 'Enter state' },
      { name: 'district', label: 'District', type: 'text', required: false, placeholder: 'Enter district' },
      { name: 'pincode', label: 'Pincode', type: 'text', required: false, placeholder: 'Enter pincode' },
      { name: 'date_of_birth', label: 'Date of Birth', type: 'text', required: false, placeholder: 'YYYY-MM-DD' },
      { name: 'gender', label: 'Gender', type: 'text', required: false, placeholder: 'MALE/FEMALE/OTHER' },
      { name: 'mobile_number', label: 'Mobile Number', type: 'text', required: false, placeholder: 'Enter mobile number' },
      { name: 'email', label: 'Email', type: 'text', required: false, placeholder: 'Enter email address' },
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