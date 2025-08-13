"use client"

import React, { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { gstinApi } from "../../services/api/gstinApi"
import type { Service } from "../../types/verification"

const services: Service[] = [
  {
    key: 'gstin-contact',
    name: 'GSTIN Contact Details',
    description: 'Verify contact information for any business using their GSTIN number'
  }
];

export const GstinSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [selectedService, setSelectedService] = useState<Service>(services[0])
  
  // Remove unused error state since we're not using it
  // const [error, setError] = useState<string | null>(null)

  const formFields = [
    {
      name: "gstin",
      label: "GSTIN Number",
      type: "text" as const,
      required: true,
      placeholder: "Enter 15-digit GSTIN number",
      pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
      title: "Please enter a valid 15-digit GSTIN number"
    },
    {
      name: "consent",
      label: "I consent to verify this information",
      type: "radio" as const,
      required: true,
      options: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" }
      ]
    }
  ]

  const handleSubmit = async (formData: any) => {
    if (formData.consent !== "Y") {
      console.error("Consent is required to fetch GSTIN details")
      return
    }

    setIsLoading(true)
    try {
      const response = await gstinApi.fetchContact({
        gstin: formData.gstin,
        consent: formData.consent
      })
      
      // Format the response to match the expected structure
      if (response.gstin_data) {
        setResult({
          document_type: response.gstin_data.document_type,
          email: response.gstin_data.email,
          mobile: response.gstin_data.mobile
        })
      } else {
        setResult(response)
      }
    } catch (err: any) {
      console.error('Error fetching GSTIN details:', err)
      setResult({
        error: err.message || 'Failed to fetch GSTIN details. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="GSTIN Verification"
      description="Verify GSTIN contact details"
      services={services}
      selectedService={selectedService}
      onServiceChange={setSelectedService}
    >
      <VerificationForm
        fields={formFields}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        result={result}
        error={result?.error || null}
        serviceKey="gstin-contact"
        serviceName="GSTIN Contact Details"
        serviceDescription="Verify contact information for any business using their GSTIN number"
      />
    </VerificationLayout>
  )
}

export default GstinSection
