"use client"

import type React from "react"
// import { useState } from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"
import { bankServices as bankAccountServices } from "../../config/bankConfig"
import { bankApi } from "../../services/api/bankApi"
import { usePricingContext } from "../../context/PricingContext"

export const BankAccountSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const {
    selectedService,
    isLoading,
    result,
    error,
    showConfirmDialog,
    showNoQuotaDialog,
    pendingFormData,
    handleServiceChange,
    initiateSubmit,
    closeConfirmDialog,
    closeNoQuotaDialog,
    confirmSubmit,
  } = useVerificationLogic({
    services: bankAccountServices,
  })

  // Get Bank Account pricing from backend
  const { getVerificationPricingByType } = usePricingContext()
  // const bankPricing = getVerificationPricingByType("bank_account")

  const getFormFields = (service: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return service.formFields.map((field: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (field.name === "consent") {
        return {
          ...field,
          type: "radio" as const,
          options: [
            { label: "Yes", value: "Y" },
            { label: "No", value: "N" },
          ],
        }
      }
      return field
    })
  }

  const handleConfirmSubmit = async () => {
    await confirmSubmit(async (formData: any) => {
      // Normalize payload
      const payload: any = { ...formData }
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N"
      }
      if (payload.ifsc) {
        payload.ifsc = String(payload.ifsc).toUpperCase().trim()
      }
      if (payload.account_number) {
        payload.account_number = String(payload.account_number).trim()
      }
      if (payload.vpa) {
        payload.vpa = String(payload.vpa).trim()
      }

      // Console: request summary (masked)
      const maskedAcc = payload.account_number ? String(payload.account_number).replace(/.(?=.{4})/g, "X") : undefined
      console.info("[Bank] Submit", {
        service: selectedService?.key,
        account_number: maskedAcc,
        ifsc: payload.ifsc,
        vpa: payload.vpa,
        consent: payload.consent,
      })

      let response: any
      try {
        switch (selectedService.key) {
          case "account-verify":
            response = await bankApi.verifyAccount({
              account_number: payload.account_number,
              ifsc: payload.ifsc,
              consent: payload.consent,
            })
            break
          case "ifsc-validate":
            response = await bankApi.validateIfsc({
              ifsc: payload.ifsc,
              consent: payload.consent, // bankApi might expect consent, adding it to be safe or based on interface
            })
            break
          case "upi-verify":
            response = await bankApi.verifyUpi({
              vpa: payload.vpa,
              consent: payload.consent, // bankApi might expect consent
            })
            break
          default:
            response = await bankApi.post(selectedService.apiEndpoint, payload)
        }

        const raw = response?.data || response
        const inner = raw?.data || raw

        // Special handling for UPI verification - check response code
        if (selectedService.key === "upi-verify") {
          const responseCode = inner?.code || raw?.data?.code || raw?.code
          const upiData = inner?.upi_data || raw?.upi_data
          const upiId = payload?.vpa || payload?.upi

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
    })
  }

  return (
    <>
      <VerificationLayout
        title="Bank Verification Services"
        description="Verify Bank Accounts, UPI, and IFSC codes"
        services={bankAccountServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any}
      >
        <VerificationForm
          fields={getFormFields(selectedService)}
          onSubmit={async (data: any) => initiateSubmit(data)}
          isLoading={isLoading}
          result={result}
          error={error}
          serviceKey={selectedService.key}
          serviceName={selectedService.name}
          serviceDescription={selectedService.description}
          productId={productId}
        />
      </VerificationLayout>

      <VerificationConfirmDialog
        isOpen={showConfirmDialog}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
        serviceName={selectedService.name}
        formData={pendingFormData || {}}
        tokenCost={1}
      />

      <NoQuotaDialog
        isOpen={showNoQuotaDialog}
        onClose={closeNoQuotaDialog}
        serviceName={selectedService.name}
      />
    </>
  )
}
