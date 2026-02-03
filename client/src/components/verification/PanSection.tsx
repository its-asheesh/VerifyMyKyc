"use client"

import type React from "react"
import { panServices } from "../../config/panConfig"
import { identityApi } from "../../services/api/identityApi"
import { GenericVerificationSection } from "./GenericVerificationSection"

interface PanFormData {
  pan?: string;
  father_name?: string;
  date_of_birth?: string;
  consent: string | boolean;
  [key: string]: unknown;
}

interface PanApiPayload {
  pan_number: string;
  consent: "Y" | "N";
  father_name?: string;
  date_of_birth?: string;
  [key: string]: unknown;
}

export const PanSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: PanFormData): PanApiPayload => {
    const payload: Partial<PanApiPayload> = {}

    // Map form 'pan' to API 'pan_number'
    if (formData.pan) {
      payload.pan_number = formData.pan.trim();
    }

    // Handle other fields
    for (const [k, v] of Object.entries(formData)) {
      if (k === 'pan') continue; // Handled above

      if (typeof v === "boolean") {
        if (k === 'consent') payload[k] = v ? "Y" : "N";
        else payload[k] = v ? "Y" : "N" as any;
      } else if (typeof v === "string") {
        payload[k] = v.trim()
      } else {
        payload[k] = v
      }
    }

    if (!payload.pan_number) throw new Error("PAN is required");

    const consentVal = formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N';

    return {
      ...payload,
      pan_number: payload.pan_number!,
      consent: consentVal
    } as PanApiPayload;
  }

  const handleApiAction = async (serviceKey: string, payload: PanApiPayload) => {
    switch (serviceKey) {
      case "father-name":
        return await identityApi.fetchPanFatherName({
          pan_number: payload.pan_number,
          consent: payload.consent,
          // Only generic signature allows extra fields, but fetchPanFatherName is strict.
          // However, looking at types/kyc.ts, PanFatherNameRequest ONLY has pan_number and consent.
          // If we include father_name here (as logic implied), it might be wrong?
          // Checking type definition: export interface PanFatherNameRequest { pan_number: string; consent: string; }
          // So we should NOT pass father_name or extra fields.
        })
      default:
        const service = panServices.find(s => s.key === serviceKey)
        return await identityApi.post(service?.apiEndpoint || "", payload)
    }
  }

  return (
    <GenericVerificationSection<typeof panServices[number], PanFormData, PanApiPayload>
      services={panServices}
      title="PAN Verification Services"
      description="Verify PAN details"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  )
}
