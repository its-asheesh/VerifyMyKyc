"use client"
// Re-exporting for editor refresh

import type React from "react"
import { useState } from "react"
import { useVerificationLogic } from "../../hooks/useVerificationLogic"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"
import { aadhaarServices } from "../../config/aadhaarConfig"
import { identityApi } from "../../services/api/identityApi"
import { usePricingContext } from "../../context/PricingContext"
import OtpInputWithTimer from "../forms/OtpInputWithTimer"

interface AadhaarFormData {
  id_number?: string;
  consent: string | boolean;
  base64_data?: string;
  file_front?: File;
  file_back?: File;
  json?: string;
}

export const AadhaarSection: React.FC<{ productId?: string }> = ({ productId }) => {
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
    setError,
    setResult,
    setIsLoading,
  } = useVerificationLogic<typeof aadhaarServices[number], AadhaarFormData>({
    services: aadhaarServices,
  })

  // V2 OTP Flow State
  const [otpStep, setOtpStep] = useState<"enter-aadhaar" | "enter-otp">("enter-aadhaar")
  const [otpValue, setOtpValue] = useState("")
  const [requestId, setRequestId] = useState<number | null>(null)
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [consent, setConsent] = useState("Y")

  // Get Aadhaar pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const aadhaarPricing = getVerificationPricingByType("aadhaar")

  // Reset OTP state when service changes
  const onServiceChange = (service: typeof aadhaarServices[number]) => {
    handleServiceChange(service)
    setOtpStep("enter-aadhaar")
    setOtpValue("")
    setRequestId(null)
    setAadhaarNumber("")
  }

  const getFormFields = (service: typeof aadhaarServices[number]) => {
    // ... (keep existing getFormFields logic)
    return service.formFields.map((field) => {
      switch (field.name) {
        case "consent":
          return {
            ...field,
            type: "radio" as const,
            options: [
              { label: "Yes", value: "Y" },
              { label: "No", value: "N" },
            ],
          }
        case "id_number":
          return {
            ...field,
            type: "text" as const,
            placeholder: "Enter 12-digit Aadhaar number",
            pattern: "^[0-9]{12}$",
            maxLength: 12,
          }
        case "base64_data":
          return {
            ...field,
            type: "camera" as const,
            label: "Capture Aadhaar Image",
          }
        case "file_front":
          return {
            ...field,
            type: "file" as const,
            accept: "image/*",
            multiple: false,
          }
        case "file_back":
          return {
            ...field,
            type: "file" as const,
            accept: "image/*",
            multiple: false,
          }
        case "json":
          return {
            ...field,
            type: "json" as const,
            placeholder: "Enter JSON payload…",
          }
        default:
          return field
      }
    })
  }

  const handleConfirmSubmit = async () => {
    await confirmSubmit(async (formData: AadhaarFormData) => {
      if (selectedService.key === "v2-verify") {
        const aadhaarNum = formData.id_number?.trim()

        const consentVal = typeof formData.consent === 'string' ? formData.consent : (formData.consent ? 'Y' : 'N');

        const response = await identityApi.aadhaarGenerateOtpV2({
          id_number: aadhaarNum || "",
          consent: consentVal as "Y" | "N",
        })

        if (response.data?.otp_sent) {
          setRequestId(response.request_id)
          setAadhaarNumber(aadhaarNum || "")
          setConsent(consentVal)
          setOtpStep("enter-otp")
          return {
            ...response,
            message: response.message || "OTP sent successfully to your registered mobile number",
          }
        } else {
          throw new Error(response.message || "Failed to send OTP")
        }
      } else {
        // Handle other services (e.g. OCR if added back)
        throw new Error("Unknown service")
      }
    })
  }

  const handleSubmitOtp = async () => {
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    if (!requestId) {
      setError("Invalid request. Please start again.")
      setOtpStep("enter-aadhaar")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await identityApi.aadhaarSubmitOtpV2({
        request_id: requestId,
        otp: otpValue,
        consent: consent,
      })

      if (response.status === "success" && response.data) {
        setResult(response)
        setOtpStep("enter-aadhaar")
        setOtpValue("")
      } else {
        throw new Error(response.message || "OTP verification failed")
      }
    } catch (err: any) {
      console.error("Aadhaar V2 Submit OTP Error:", err)
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid OTP. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!aadhaarNumber) {
      setError("Aadhaar number not found. Please start again.")
      setOtpStep("enter-aadhaar")
      return
    }

    // Manually trigger generate OTP without dialog
    setIsLoading(true)
    setError(null)
    try {
      const response = await identityApi.aadhaarGenerateOtpV2({
        id_number: aadhaarNumber,
        consent: consent,
      })
      if (response.data?.otp_sent) {
        setRequestId(response.request_id)
        setResult({
          ...response,
          message: "OTP resent successfully",
        })
      } else {
        throw new Error(response.message || "Failed to resend OTP")
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <VerificationLayout
        title="Aadhaar Verification Services"
        description="Verify Aadhaar via OTP or OCR"
        services={aadhaarServices}
        selectedService={selectedService}
        onServiceChange={onServiceChange}
      >
        {otpStep === "enter-otp" ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Enter OTP</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please enter the 6-digit OTP sent to the mobile number registered with Aadhaar {aadhaarNumber.slice(-4)}.
            </p>

            <OtpInputWithTimer
              value={otpValue}
              onChange={setOtpValue}
              onResend={handleResendOtp}
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setOtpStep("enter-aadhaar")}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleSubmitOtp}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                disabled={isLoading || otpValue.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        ) : (
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
        )}
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
