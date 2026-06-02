"use client"

import type React from "react"
import { drivingLicenseServices } from "../../config/drivingLicenseConfig"
import { identityApi } from "../../services/api/identityApi"
import { GenericVerificationSection } from "./GenericVerificationSection"

interface DlFormData {
  dl_number: string;
  dob: string;
  consent: string | boolean;
  [key: string]: unknown;
}

interface DlApiPayload {
  driving_license_number: string;
  date_of_birth: string;
  consent: "Y" | "N";
  [key: string]: unknown;
}

export const DrivingLicenseSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: DlFormData): DlApiPayload => {
    return {
      driving_license_number: formData.dl_number,
      date_of_birth: formData.dob,
      consent: formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N'
    } as DlApiPayload;
  }

  const handleApiAction = async (serviceKey: string, payload: DlApiPayload) => {
    switch (serviceKey) {
      case "fetch-details":
        return await identityApi.fetchDlDetails({
          driving_license_number: payload.driving_license_number,
          date_of_birth: payload.date_of_birth,
          consent: payload.consent,
        })
      default:
        throw new Error("Unknown service")
    }
  }

  return (
    <GenericVerificationSection<typeof drivingLicenseServices[number], DlFormData, DlApiPayload>
      services={drivingLicenseServices}
      title="Driving License Verification Services"
      description="Verify Driving License details instantly"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  )
}
