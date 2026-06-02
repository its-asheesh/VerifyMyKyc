"use client"

import type React from "react"
import { companyServices } from "../../config/companyConfig"
import { businessApi } from "../../services/api/businessApi"
import { GenericVerificationSection } from "./GenericVerificationSection"

interface CompanyFormData {
  cin: string;
  consent: string | boolean;
  [key: string]: unknown;
}

interface CompanyApiPayload {
  cin: string;
  consent: "Y" | "N";
  [key: string]: unknown;
}

export const CompanySection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: CompanyFormData): CompanyApiPayload => {
    return {
      ...formData,
      consent: formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N'
    } as CompanyApiPayload;
  }

  const handleApiAction = async (serviceKey: string, payload: CompanyApiPayload) => {
    switch (serviceKey) {
      case "fetch-company":
        return await businessApi.mcaFetchCompany({
          cin: payload.cin,
          consent: payload.consent,
        })
      default:
        return await businessApi.post(
          companyServices.find(s => s.key === serviceKey)?.apiEndpoint || "",
          payload
        )
    }
  }

  return (
    <GenericVerificationSection<typeof companyServices[number], CompanyFormData, CompanyApiPayload>
      services={companyServices}
      title="Company Verification Services"
      description="Verify Company/LLP details via CIN/LLPIN"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  )
}
