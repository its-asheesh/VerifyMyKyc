"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { gstinServices } from "../../utils/gstinServices"
import { gstinApi } from "../../services/api/gstinApi"

export const GstinSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState(gstinServices[0])
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
      return field
    })
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Normalize payload
      const payload: any = { ...formData }
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N"
      }
      if (payload.gstin) {
        payload.gstin = String(payload.gstin).toUpperCase().trim()
      }

      let response: any
      switch (selectedService.key) {
        case "contact":
          response = await gstinApi.contact(payload)
          break
        case "lite":
          response = await gstinApi.fetchLite(payload)
          break
        default:
          // Fallback to direct post using service metadata endpoint
          response = await gstinApi.post(selectedService.apiEndpoint, payload)
      }

      // Transform response for generic renderer in VerificationForm
      const raw = response?.data || response
      const inner = raw?.data || raw

      const derivedName =
        inner?.legal_name ||
        inner?.trade_name ||
        inner?.business_name ||
        inner?.legalName ||
        inner?.tradeName ||
        inner?.businessName ||
        inner?.name

      const derivedDocNum =
        inner?.gstin ||
        payload?.gstin ||
        inner?.document_number ||
        inner?.documentNumber ||
        inner?.number ||
        inner?.id

      const derivedStatus = response?.status || raw?.status || response?.message || raw?.message

      const transformed: any = { data: { ...inner } }
      if (derivedName && !transformed.data.name) transformed.data.name = derivedName
      if (derivedDocNum && !transformed.data.document_number) transformed.data.document_number = derivedDocNum
      if (derivedStatus && !transformed.data.status) transformed.data.status = derivedStatus

      setResult(transformed)
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || err?.data?.message
      setError(backendMsg || err?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="GSTIN Verification Services"
      description="Verify business GSTIN details and contact information"
      services={gstinServices}
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
