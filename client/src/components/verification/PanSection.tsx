"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { panServices, DIGILOCKER_REDIRECT_URI } from "../../utils/panServices"
import { panApi } from "../../services/api/panApi"
import { usePricingContext } from "../../context/PricingContext"

export const PanSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState(panServices[0])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Get PAN pricing from backend
  const { getVerificationPricingByType } = usePricingContext()
  const panPricing = getVerificationPricingByType("pan")

  // Clear results when service changes
  const handleServiceChange = (service: any) => {
    setSelectedService(service)
    setResult(null)
    setError(null)
  }

  // Handle Digilocker callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const transactionId = params.get("transaction_id")

    if (transactionId && selectedService.key === "digilocker-pull") {
      const panno = sessionStorage.getItem("digilocker_pan_pull_panno")
      const PANFullName = sessionStorage.getItem("digilocker_pan_pull_name")

      if (panno && PANFullName) {
        handleDigilockerPull(transactionId, panno, PANFullName)
      }
    }
  }, [selectedService.key])

  const handleDigilockerPull = async (transactionId: string, panno: string, PANFullName: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await panApi.digilockerPull({
        parameters: { panno, PANFullName },
        transactionId,
      })
      setResult(response)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
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
      if (field.type === "json") {
        return {
          ...field,
          placeholder: "Enter JSON payload...",
        }
      }
      return {
        ...field,
        placeholder:
          field.name === "pan_number"
            ? "Enter PAN number (e.g., ABCDE1234F)"
            : field.name === "aadhaar_number"
              ? "Enter 12-digit Aadhaar number"
              : field.name === "PANFullName"
                ? "Enter full name as per PAN"
                : undefined,
      }
    })
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      if (selectedService.key === "digilocker-pull") {
        // Store data for after redirect
        sessionStorage.setItem("digilocker_pan_pull_panno", formData.panno)
        sessionStorage.setItem("digilocker_pan_pull_name", formData.PANFullName)

        const initResp = await panApi.digilockerInit({
          redirect_uri: DIGILOCKER_REDIRECT_URI,
          consent: "Y",
        })

        const url = initResp?.data?.authorization_url
        if (url) {
          window.location.href = url
          return
        } else {
          throw new Error("Failed to get Digilocker authorization URL")
        }
      }

      // Convert boolean consent to string
      if (typeof formData.consent === "boolean") {
        formData.consent = formData.consent ? "Y" : "N"
      }

      switch (selectedService.key) {
        case "father-name":
          response = await panApi.fetchFatherName(formData)
          break
        case "aadhaar-link":
          response = await panApi.checkAadhaarLink(formData)
          break
        default:
          response = await panApi.post(selectedService.apiEndpoint, formData)
      }

      setResult(response)
    } catch (err: any) {
      setError(err?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VerificationLayout
      title="PAN Verification Services"
      description="Comprehensive PAN card verification and related services"
      services={panServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Display pricing if available */}
      {panPricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-blue-600">One-time: ₹{panPricing.oneTimePrice}</span>
            <span className="text-blue-600">Monthly: ₹{panPricing.monthlyPrice}</span>
            <span className="text-blue-600">Yearly: ₹{panPricing.yearlyPrice}</span>
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
