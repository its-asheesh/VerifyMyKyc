"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"
import { bankServices } from "../../utils/bankServices"
import { bankApi } from "../../services/api/bankApi"

export const BankAccountSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(bankServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showNoQuotaDialog, setShowNoQuotaDialog] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<any>(null)

  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
  }

  const getFormFields = (service: any) => {
    return service.formFields.map((field: any) => {
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

  const handleSubmit = async (formData: any) => {
    setPendingFormData(formData)
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false)
    setIsLoading(true)
    setError(null)
    setResult(null)

    const formData = pendingFormData

    try {
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
      switch (selectedService.key) {
        case "account-verify":
          response = await bankApi.verifyAccount(payload)
          break
        case "ifsc-validate":
          response = await bankApi.validateIfsc(payload)
          break
        case "upi-verify":
          response = await bankApi.verifyUpi(payload)
          break
        default:
          response = await bankApi.post(selectedService.apiEndpoint, payload)
      }

      const raw = response?.data || response
      const inner = raw?.data || raw

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

      setResult(transformed)
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || err?.data?.message || err?.message || ""
      console.error("[Bank] Error", err?.response?.status, backendMsg, err?.response?.data)
      // Check for quota error and show NoQuotaDialog
      if (err?.response?.status === 403 || /quota|exhaust|exhausted|limit|token/i.test(backendMsg)) {
        setShowNoQuotaDialog(true)
      } else {
        setError(backendMsg || "An error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <VerificationLayout
        title="Bank Verification Services"
        description="Verify bank account holder details, validate IFSC, and verify UPI IDs"
        services={bankServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange}
      >
        <VerificationForm
          fields={getFormFields(selectedService)}
          onSubmit={handleSubmit}
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
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
        serviceName={selectedService.name}
        formData={pendingFormData || {}}
        tokenCost={1}
      />

      <NoQuotaDialog
        isOpen={showNoQuotaDialog}
        onClose={() => setShowNoQuotaDialog(false)}
        serviceName={selectedService.name}
        verificationType="bank"
      />
    </>
  )
}
