"use client"

import type React from "react"
import { useState } from "react"
import { VerificationLayout } from "./VerificationLayout"
import { VerificationForm } from "./VerificationForm"
import { epfoApi } from "../../services/api/epfoApi"
import { VerificationConfirmDialog } from "./VerificationConfirmDialog"
import { NoQuotaDialog } from "./NoQuotaDialog"

type ServiceKey =
  | "fetchUan"
  | "generateOtp"
  | "fetchPassbook"
  | "employmentByUan"
  | "employmentLatest"
  | "uanByPan"
  | "employerVerify"

const services = [
  {
    key: "fetchUan" as ServiceKey,
    name: "Fetch UAN",
    description: "Retrieve UANs linked to a mobile number and optional PAN",
    formFields: [
      { name: "mobile_number", label: "Mobile Number", type: "text", required: true, placeholder: "Enter 10-digit mobile number" },
      { name: "pan", label: "PAN (optional)", type: "text", required: false, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "uanByPan" as ServiceKey,
    name: "Fetch UAN by PAN",
    description: "Fetch UAN using PAN number",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
//   {
//     key: "generateOtp" as ServiceKey,
//     name: "Generate OTP (Passbook)",
//     description: "Start passbook flow with UAN",
//     formFields: [
//       { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
//       { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
//     ],
//   },
//   {
//     key: "fetchPassbook" as ServiceKey,
//     name: "Fetch Passbook",
//     description: "Fetch passbook for a selected member and office (optionally validate OTP internally)",
//     formFields: [
//       { name: "transaction_id", label: "Transaction ID", type: "text", required: true, placeholder: "Enter transaction ID" },
//       { name: "otp", label: "OTP (if prompted)", type: "text", required: false, placeholder: "Enter OTP" },
//       { name: "member_id", label: "Member ID", type: "text", required: true, placeholder: "Enter member ID" },
//       { name: "office_id", label: "Office ID", type: "text", required: true, placeholder: "Enter office ID" },
//     ],
//   },
  {
    key: "employmentByUan" as ServiceKey,
    name: "Employment by UAN",
    description: "Fetch employment history using UAN",
    formFields: [
      { name: "uan_number", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "employmentLatest" as ServiceKey,
    name: "Latest Employment by UAN",
    description: "Fetch latest employment record using UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
//   {
//     key: "employerVerify" as ServiceKey,
//     name: "Verify Employer",
//     description: "Verify establishment details and PF payments",
//     formFields: [
//       { name: "employer_name", label: "Employer Name", type: "text", required: true },
//       { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
//     ],
//   },
]

export const EpfoSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(services[0])
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

    try {
      const payload: any = { ...pendingFormData }
      if (typeof payload.consent === "boolean") payload.consent = payload.consent ? "Y" : "N"

      console.log("[EPFO] Submitting", { serviceKey: selectedService.key, payload })
      let response: any
      switch (selectedService.key as ServiceKey) {
        case "fetchUan":
          response = await epfoApi.fetchUan(payload)
          break
        case "uanByPan":
          response = await epfoApi.uanByPan(payload)
          break
        case "generateOtp":
          response = await epfoApi.generateOtp(payload)
          break
        case "fetchPassbook":
          if (payload.otp) {
            try { await epfoApi.validateOtp(payload.transaction_id, { otp: payload.otp }) } catch (e) { throw e }
          }
          try { await epfoApi.listEmployers(payload.transaction_id) } catch {}
          response = await epfoApi.fetchPassbook(payload.transaction_id, { member_id: payload.member_id, office_id: payload.office_id })
          break
        case "employmentByUan":
          response = await epfoApi.employmentByUan(payload)
          break
        case "employmentLatest":
          response = await epfoApi.employmentLatest(payload)
          break
        case "employerVerify":
          response = await epfoApi.employerVerify(payload)
          break
        default:
          response = null
      }

      const raw = (response as any)?.data || response
      const inner = raw?.data || raw
      setResult({ data: inner })
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error || err?.data?.message || err?.message || ""
      console.error("[EPFO] Error", err?.response?.status, backendMsg, err?.response?.data)
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
    <VerificationLayout
      title="EPFO Verification Services"
      description="Fetch UAN, passbook, employment history, and verify employer details"
      showWhyChooseUs={false}
      services={services}
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

      <NoQuotaDialog
        isOpen={showNoQuotaDialog}
        onClose={() => setShowNoQuotaDialog(false)}
        serviceName={selectedService.name}
        verificationType="epfo"
      />
    </VerificationLayout>
  )
}


