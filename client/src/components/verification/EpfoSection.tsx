"use client"

import type React from "react"
import { GenericVerificationSection } from "./GenericVerificationSection"
import { businessApi } from "../../services/api/businessApi"

type ServiceKey =
  | "fetch-uan"
  | "employment-by-uan"
  | "employment-latest"
  | "uan-by-pan"
  | "claim-status"
  | "kyc-status"

const services = [
  {
    key: "fetch-uan" as ServiceKey,
    name: "Fetch UAN",
    description: "Retrieve UANs linked to a mobile number and optional PAN",
    formFields: [
      { name: "mobile_number", label: "Mobile Number", type: "text", required: true, placeholder: "Enter 10-digit mobile number" },
      { name: "pan", label: "PAN (optional)", type: "text", required: false, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "uan-by-pan" as ServiceKey,
    name: "Fetch UAN by PAN",
    description: "Fetch UAN using PAN number",
    formFields: [
      { name: "pan_number", label: "PAN Number", type: "text", required: true, placeholder: "Enter 10-character PAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "employment-by-uan" as ServiceKey,
    name: "Employment by UAN",
    description: "Fetch employment history using UAN",
    formFields: [
      { name: "uan_number", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "employment-latest" as ServiceKey,
    name: "Latest Employment by UAN",
    description: "Fetch latest employment record using UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "claim-status" as ServiceKey,
    name: "Fetch Claim Status",
    description: "Fetch the status of an EPFO claim using UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
  {
    key: "kyc-status" as ServiceKey,
    name: "Fetch KYC Status",
    description: "Fetch the KYC status for a given UAN",
    formFields: [
      { name: "uan", label: "UAN", type: "text", required: true, placeholder: "Enter UAN number" },
      { name: "consent", label: "Consent", type: "radio", required: true, options: [{ label: "Yes", value: "Y" }, { label: "No", value: "N" }] },
    ],
  },
]


interface EpfoFormData {
  mobile_number?: string;
  pan_number?: string;
  uan_number?: string;
  uan?: string;
  consent: string | boolean;
  [key: string]: unknown;
}

interface EpfoApiPayload {
  mobile_number?: string;
  pan_number?: string;
  uan_number?: string;
  uan?: string;
  consent: "Y" | "N";
  [key: string]: unknown;
}

export const EpfoSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: EpfoFormData): EpfoApiPayload => {
    return {
      ...formData,
      consent: formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N'
    } as EpfoApiPayload;
  }

  const handleApiAction = async (serviceKey: string, payload: EpfoApiPayload) => {
    switch (serviceKey) {
      case "fetch-uan":
        return await businessApi.epfoFetchUan({
          mobile_number: payload.mobile_number || "",
          consent: payload.consent,
        })
      case "uan-by-pan":
        return await businessApi.epfoUanByPan({
          pan_number: payload.pan_number || "",
          consent: payload.consent,
        })
      case "employment-by-uan":
        return await businessApi.epfoEmploymentByUan({
          uan_number: payload.uan_number || "",
          consent: payload.consent,
        })
      case "employment-latest":
        return await businessApi.epfoEmploymentLatest({
          uan: payload.uan || "",
          consent: payload.consent,
        })
      case "claim-status":
        return await businessApi.epfoClaimStatus({
          uan: payload.uan || "",
          consent: payload.consent,
        })
      case "kyc-status":
        return await businessApi.epfoKycStatus({
          uan: payload.uan || "",
          consent: payload.consent,
        })
      default:
        throw new Error("Unknown service")
    }
  }

  return (
    <GenericVerificationSection<typeof services[number], EpfoFormData, EpfoApiPayload>
      services={services}
      title="EPFO Verification Services"
      description="Verify EPFO details"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  )
}
