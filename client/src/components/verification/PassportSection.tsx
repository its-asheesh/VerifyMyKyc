"use client";

import type React from "react";
import { passportServices } from "../../config/passportConfig";
import { identityApi } from "../../services/api/identityApi";
import { GenericVerificationSection } from "./GenericVerificationSection";

interface PassportFormData {
  file_number: string;
  date_of_birth: string;
  consent: string | boolean;
  [key: string]: unknown;
}

interface PassportApiPayload {
  file_number: string;
  date_of_birth: string;
  consent: "Y" | "N";
}

export const PassportSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: PassportFormData): PassportApiPayload => {
    return {
      file_number: formData.file_number,
      date_of_birth: formData.date_of_birth,
      consent: formData.consent === true || formData.consent === 'Y' ? 'Y' : 'N'
    };
  }

  const preprocessFields = (fields: any[]) => {
    return fields.map((field) => {
      if (field.name === "file_front" || field.name === "file_back") {
        return {
          ...field,
          type: "file" as const,
          accept: "image/*",
        }
      }
      return field
    })
  }

  const handleApiAction = async (serviceKey: string, payload: PassportApiPayload) => {
    switch (serviceKey) {
      case "fetch":
        return await identityApi.fetchPassportDetails({
          file_number: payload.file_number,
          date_of_birth: payload.date_of_birth,
          consent: payload.consent,
        })
      default:
        throw new Error("Unknown service")
    }
  }

  return (
    <GenericVerificationSection<typeof passportServices[number], PassportFormData, PassportApiPayload>
      services={passportServices}
      title="Passport Verification Services"
      description="Verify Passport details instantly"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
      preprocessFields={preprocessFields}
    />
  );
};