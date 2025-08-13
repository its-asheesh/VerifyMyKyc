"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { bankingServices } from "../../utils/bankingServices"
import { bankingApi } from "../../services/api/bankingApi"
import { usePricingContext } from "../../context/PricingContext"

export const BankingSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState(bankingServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const { getVerificationPricingByType } = usePricingContext()
  const pricing = getVerificationPricingByType("bankaccount")

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
      if (typeof formData.consent === "boolean") {
        formData.consent = formData.consent ? "Y" : "N"
      }
      const response = await bankingApi.verifyBankAccount(formData)
      setResult(response)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="Banking & Finance"
      description="Verify bank accounts securely using account number and IFSC"
      services={bankingServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {pricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-blue-600">One-time: ₹{pricing.oneTimePrice}</span>
            <span className="text-blue-600">Monthly: ₹{pricing.monthlyPrice}</span>
            <span className="text-blue-600">Yearly: ₹{pricing.yearlyPrice}</span>
          </div>
        </div>
      )}

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


