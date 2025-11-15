"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { companyServices } from "../../utils/companyServices"
import { mcaApi } from "../../services/api/mcaApi"
 

export const CompanySection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(companyServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
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
      return {
        ...field,
        placeholder: field.placeholder || (field.name === "company_id" ? "Enter CIN / FCRN / LLPIN" : undefined),
      }
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

    try {
      const payload: any = { ...pendingFormData }
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N"
      }
      const response = await mcaApi.fetchCompany(payload)
      const raw = (response as any)?.data || response
      setResult(raw)
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || err?.data?.message
      setError(backendMsg || err?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="Company Verification (MCA)"
      description="Fetch company details from MCA using CIN / FCRN / LLPIN."
      services={companyServices}
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

      <VerificationConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
        serviceName={selectedService.name}
        formData={pendingFormData || {}}
        tokenCost={1}
      />
    </VerificationLayout>
  )
}
