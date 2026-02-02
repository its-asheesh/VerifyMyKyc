import type { BankAccountVerifyRequest, IfscValidateRequest, UpiVerifyRequest } from "../types/kyc"
import { FileText } from "lucide-react"

export type BankServiceKey = "account-verify" | "ifsc-validate" | "upi-verify"

export interface BankServiceMeta {
  key: BankServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: Array<{
    name: keyof BankAccountVerifyRequest | keyof IfscValidateRequest | keyof UpiVerifyRequest | string
    label: string
    type: "text" | "radio"
    required: boolean
    options?: Array<{ label: string; value: string }>
    pattern?: string
    title?: string
    placeholder?: string
  }>
  icon?: React.ElementType
}

export const bankServices: BankServiceMeta[] = [
  {
    key: "account-verify",
    name: "Bank Account Verification",
    description: "Verify bank account details with IFSC and optional name match",
    apiEndpoint: "/bank/verify-account",
    formFields: [
      {
        name: "account_number",
        label: "Account Number",
        type: "text",
        required: true,
        placeholder: "Enter 9-18 digit account number",
      },
      {
        name: "ifsc",
        label: "IFSC Code",
        type: "text",
        required: true,
        placeholder: "Enter IFSC code (e.g., HDFC0001234)",
        pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
        title: "Please enter a valid 11-character IFSC code",
      },
      {
        name: "name_as_per_bank",
        label: "Name as per Bank (optional)",
        type: "text",
        required: false,
        placeholder: "Enter account holder name for match (optional)",
      },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ],
    icon: FileText,
  },
  // {
  //   key: "ifsc-validate",
  //   name: "IFSC Validation",
  //   description: "Validate IFSC and fetch branch/bank details",
  //   apiEndpoint: "/bank/verify-ifscc",
  //   formFields: [
  //     {
  //       name: "ifsc",
  //       label: "IFSC Code",
  //       type: "text",
  //       required: true,
  //       placeholder: "Enter IFSC code (e.g., SBIN0000001)",
  //       pattern: "^[A-Z]{4}0[A-Z0-9]{6}$",
  //       title: "Please enter a valid 11-character IFSC code",
  //     },
  //     {
  //       name: "consent",
  //       label: "Consent",
  //       type: "radio",
  //       required: true,
  //       options: [
  //         { label: "Yes", value: "Y" },
  //         { label: "No", value: "N" },
  //       ],
  //     },
  //   ],
  //   icon: FileText,
  // },
  {
    key: "upi-verify",
    name: "UPI ID Verification",
    description: "Verify UPI VPA (vpa@bank) and fetch account holder name",
    apiEndpoint: "/bank/verify-upi",
    formFields: [
      {
        name: "vpa",
        label: "UPI ID (VPA)",
        type: "text",
        required: true,
        placeholder: "username@bank",
      },
      {
        name: "consent",
        label: "Consent",
        type: "radio",
        required: true,
        options: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ],
    icon: FileText,
  },
]
