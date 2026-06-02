"use client"

import type React from "react"
import { gstinServices } from "../../config/gstinConfig"
import { businessApi } from "../../services/api/businessApi"
import { GenericVerificationSection } from "./GenericVerificationSection"

interface GstinFormData {
  gstin: string;
  consent: string | boolean;
  [key: string]: unknown;
}

interface GstinApiPayload {
  gstin: string;
  consent: "Y" | "N";
  [key: string]: unknown;
}

export const GstinSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: GstinFormData): GstinApiPayload => {
    return {
      ...formData,
      consent: formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N'
    } as GstinApiPayload;
  }

  const handleApiAction = async (serviceKey: string, payload: GstinApiPayload) => {
    switch (serviceKey) {
      case "contact":
        return await businessApi.gstinContact({
          gstin: payload.gstin,
          consent: payload.consent,
        })
      case "lite":
        return await businessApi.gstinFetchLite({
          gstin: payload.gstin,
          consent: payload.consent,
        })
      default:
        throw new Error("Unknown service")
    }
  }

  return (
    <GenericVerificationSection<typeof gstinServices[number], GstinFormData, GstinApiPayload>
      services={gstinServices}
      title="GSTIN Verification Services"
      description="Verify GSTIN details instantly"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  )
}
