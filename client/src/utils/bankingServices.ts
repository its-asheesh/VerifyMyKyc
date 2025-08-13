import type React from "react"
import { CreditCard } from "lucide-react"

export type BankingServiceKey = "bank-account-verify"

export interface BankingServiceMeta {
  key: BankingServiceKey
  name: string
  description: string
  apiEndpoint: string
  formFields: {
    name: string
    label: string
    type: "text" | "json"
    required: boolean
  }[]
  icon?: React.ElementType
}

export const bankingServices: BankingServiceMeta[] = [
  {
    key: "bank-account-verify",
    name: "Verify Bank Account",
    description: "Verify bank account details using account number and IFSC.",
    apiEndpoint: "/api/bankaccount/verify",
    formFields: [
      { name: "account_number", label: "Account Number", type: "text", required: true },
      { name: "ifsc", label: "IFSC Code", type: "text", required: true },
      { name: "consent", label: "Consent", type: "text", required: true },
    ],
    icon: CreditCard,
  },
]


