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

      // Prepare payload: normalize PAN and consent where applicable
      const payload: any = { ...formData }
      // Convert boolean consent to string
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N"
      }
      // For PAN-based services, uppercase and trim PAN values
      const panServicesNeedingNormalization = ["gstin-by-pan", "din-by-pan", "cin-by-pan"]
      if (panServicesNeedingNormalization.includes(selectedService.key)) {
        if (payload.pan) payload.pan = String(payload.pan).toUpperCase().trim()
        if (payload.pan_number) payload.pan_number = String(payload.pan_number).toUpperCase().trim()
        // Default consent to 'Y' if missing (some providers require consent)
        if (!payload.consent) payload.consent = "Y"
        // Basic PAN format validation (e.g., ABCDE1234F)
        const panValue = payload.pan || payload.pan_number
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/
        if (!panRegex.test(String(panValue || ''))) {
          throw new Error("Please enter a valid PAN (format: ABCDE1234F)")
        }
        if (!payload.consent || !['Y', 'N'].includes(payload.consent)) {
          throw new Error("Please provide consent (Yes/No)")
        }
      }

      switch (selectedService.key) {
        case "father-name":
          response = await panApi.fetchFatherName(payload)
          break
        case "aadhaar-link":
          response = await panApi.checkAadhaarLink(payload)
          break
        default:
          response = await panApi.post(selectedService.apiEndpoint, payload)
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
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-blue-700">
              One-time: ₹{panPricing.oneTimePrice}
              {panPricing.oneTimeQuota?.count ? ` • Includes ${panPricing.oneTimeQuota.count} verification${panPricing.oneTimeQuota.count > 1 ? 's' : ''}` : ''}
              {panPricing.oneTimeQuota?.validityDays && panPricing.oneTimeQuota.validityDays > 0 ? ` • valid ${panPricing.oneTimeQuota.validityDays} days` : ''}
            </span>
            <span className="text-blue-700">
              Monthly: ₹{panPricing.monthlyPrice}
              {panPricing.monthlyQuota?.count ? ` • Includes ${panPricing.monthlyQuota.count} verification${panPricing.monthlyQuota.count > 1 ? 's' : ''}` : ''}
              {panPricing.monthlyQuota?.validityDays && panPricing.monthlyQuota.validityDays > 0 ? ` • valid ${panPricing.monthlyQuota.validityDays} days` : ''}
            </span>
            <span className="text-blue-700">
              Yearly: ₹{panPricing.yearlyPrice}
              {panPricing.yearlyQuota?.count ? ` • Includes ${panPricing.yearlyQuota.count} verification${panPricing.yearlyQuota.count > 1 ? 's' : ''}` : ''}
              {panPricing.yearlyQuota?.validityDays && panPricing.yearlyQuota.validityDays > 0 ? ` • valid ${panPricing.yearlyQuota.validityDays} days` : ''}
            </span>
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
