"use client"

import type React from "react"
import { voterServices } from "../../config/voterConfig"
import { identityApi } from "../../services/api/identityApi"
import { GenericVerificationSection } from "./GenericVerificationSection"

interface VoterFormData {
  voter_id: string;
  consent: string | boolean;
  [key: string]: unknown;
}

// Define exact API payload structure
interface VoterApiPayload {
  voter_id: string;
  consent: "Y" | "N";
}

export const VoterSection: React.FC<{ productId?: string }> = ({ productId }) => {
  // Transform form data to strict API payload
  const transformFormData = (formData: VoterFormData): VoterApiPayload => {
    return {
      voter_id: formData.voter_id,
      consent: formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N'
    };
  }

  const handleApiAction = async (serviceKey: string, payload: VoterApiPayload) => {
    switch (serviceKey) {
      case "boson-fetch":
        return await identityApi.voterBosonFetch({
          voter_id: payload.voter_id,
          consent: payload.consent,
        })
      default:
        throw new Error("Unknown service")
    }
  }

  return (
    <GenericVerificationSection<typeof voterServices[number], VoterFormData, VoterApiPayload>
      services={voterServices}
      title="Voter ID Verification Services"
      description="Verify Voter ID details instantly"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  )
}
