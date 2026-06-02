"use client"

import type React from "react"
import { usePricingContext } from "../../context/PricingContext"
import { bankServices as bankAccountServices } from "../../config/bankConfig"
import { bankApi } from "../../services/api/bankApi"
import { GenericVerificationSection } from "./GenericVerificationSection"

interface BankFormData {
  [key: string]: unknown;
}

interface BankApiPayload {
  account_number?: string;
  ifsc?: string;
  vpa?: string;
  consent: "Y" | "N";
  [key: string]: unknown;
}

export const BankAccountSection: React.FC<{ productId?: string }> = ({ productId }) => {
  // Get Bank Account pricing from backend (if needed later)
  // const { getVerificationPricingByType } = usePricingContext()

  const transformFormData = (formData: BankFormData): BankApiPayload => {
    const payload: Partial<BankApiPayload> = { ...formData };

    // Normalize consent
    if (typeof formData.consent === "boolean") {
      payload.consent = formData.consent ? "Y" : "N";
    } else {
      payload.consent = formData.consent === "Y" ? "Y" : "N";
    }

    // Normalize strings
    if (payload.ifsc) {
      payload.ifsc = String(payload.ifsc).toUpperCase().trim();
    }
    if (payload.account_number) {
      payload.account_number = String(payload.account_number).trim();
    }
    if (payload.vpa) {
      payload.vpa = String(payload.vpa).trim();
    }

    return payload as BankApiPayload;
  }

  const apiAction = async (serviceKey: string, payload: BankApiPayload) => {
    // Console: request summary (masked)
    const maskedAcc = payload.account_number ? String(payload.account_number).replace(/.(?=.{4})/g, "X") : undefined
    console.info("[Bank] Submit", {
      service: serviceKey,
      account_number: maskedAcc,
      ifsc: payload.ifsc,
      vpa: payload.vpa,
      consent: payload.consent,
    })

    let response: any
    try {
      switch (serviceKey) {
        case "account-verify":
          if (!payload.account_number || !payload.ifsc) throw new Error("Account number and IFSC are required");
          response = await bankApi.verifyAccount({
            account_number: payload.account_number,
            ifsc: payload.ifsc,
            consent: payload.consent,
          })
          break
        case "ifsc-validate":
          if (!payload.ifsc) throw new Error("IFSC is required");
          response = await bankApi.validateIfsc({
            ifsc: payload.ifsc,
            consent: payload.consent,
          })
          break
        case "upi-verify":
          if (!payload.vpa) throw new Error("VPA (UPI ID) is required");
          response = await bankApi.verifyUpi({
            vpa: payload.vpa,
            consent: payload.consent,
          })
          break
        default:
          const service = bankAccountServices.find(s => s.key === serviceKey)
          response = await bankApi.post(service?.apiEndpoint || "", payload)
      }

      const raw = response?.data || response
      const inner = raw?.data || raw

      // Special handling for UPI verification - check response code
      if (serviceKey === "upi-verify") {
        const responseCode = inner?.code || raw?.data?.code || raw?.code
        const upiData = inner?.upi_data || raw?.upi_data
        const upiId = payload.vpa

        // Code 1013 = Valid UPI, Code 1014 = Invalid UPI
        const isValid = responseCode === "1013" || responseCode === 1013
        const statusMessage = isValid ? "Valid UPI" : "Invalid UPI"

        const transformed: any = {
          data: {
            ...inner,
            upi_data: upiData,
            code: responseCode,
            status: statusMessage,
            isValid: isValid,
            upi_id: upiId
          }
        }

        // Add account holder name if available
        if (upiData?.name) {
          transformed.data.name = upiData.name
        }

        return transformed
      }

      const derivedName =
        inner?.account_holder_name ||
        inner?.name ||
        inner?.accountName ||
        inner?.beneficiaryName

      const derivedDocNum =
        inner?.account_number ||
        payload?.account_number ||
        inner?.ifsc ||
        payload?.ifsc ||
        inner?.vpa ||
        payload?.vpa

      const derivedStatus = response?.status || raw?.status || response?.message || raw?.message

      const transformed: any = { data: { ...inner } }
      if (derivedName && !transformed.data.name) transformed.data.name = derivedName
      if (derivedDocNum && !transformed.data.document_number) transformed.data.document_number = derivedDocNum
      if (derivedStatus && !transformed.data.status) transformed.data.status = derivedStatus

      // Console: response summary
      console.info("[Bank] Response", {
        status: response?.status ?? raw?.status,
        code: raw?.data?.code ?? raw?.code,
        message: raw?.data?.message ?? raw?.message,
        bank_account_data: inner?.bank_account_data,
      })

      return transformed
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || err?.data?.message || err?.message || ""
      const errorCode = err?.response?.data?.error?.code || err?.response?.data?.code
      console.error("[Bank] Error", err?.response?.status, backendMsg, err?.response?.data)

      // Check for FORBIDDEN_ACCESS and throw custom error
      if (errorCode === 'FORBIDDEN_ACCESS' || (err?.response?.status === 403 && /credential.*access|product.*not available/i.test(backendMsg))) {
        throw new Error(backendMsg || "Access denied. This product is not available with your current credentials.")
      }

      // Re-throw other errors for useVerificationLogic to handle
      throw err
    }
  }

  return (
    <GenericVerificationSection<typeof bankAccountServices[number], BankFormData, BankApiPayload>
      services={bankAccountServices}
      title="Bank Verification Services"
      description="Verify Bank Accounts, UPI, and IFSC codes"
      productId={productId}
      apiAction={apiAction}
      transformFormData={transformFormData}
    />
  )
}
