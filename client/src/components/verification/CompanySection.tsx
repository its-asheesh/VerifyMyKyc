"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { companyServices } from "../../utils/companyServices"
import { mcaApi } from "../../services/api/mcaApi"
 

export const CompanySection: React.FC = () => {
  const [selectedService, setSelectedService] = useState(companyServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
        placeholder: field.name === "company_id" ? "Enter CIN / FCRN / LLPIN" : undefined,
      }
    })
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      // Convert boolean consent to string if present
      if (typeof formData.consent === "boolean") {
        formData.consent = formData.consent ? "Y" : "N"
      }

      // Only one service: fetch-company
      response = await mcaApi.fetchCompany(formData)

      // Keep full response shape so the MCA renderer can show all fields
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
      />
    </VerificationLayout>
  )
}
