"use client";

import type React from "react";
import { ccrvServices } from "../../config/ccrvConfig";
import { GenericVerificationSection } from "./GenericVerificationSection";

// Schema is not strictly defined in original file, but we can infer or use a generic one
interface CcrvFormData {
  [key: string]: unknown;
}

interface CcrvApiPayload {
  [key: string]: unknown;
}

export const CcrvSection: React.FC<{ productId?: string }> = ({ productId }) => {

  const preprocessFields = (fields: any[]) => {
    const placeholders: Record<string, string> = {
      name: "Enter full name",
      father_name: "Enter father's name",
      house_number: "Enter house number",
      locality: "Enter locality",
      city: "Enter city",
      village: "Enter village",
      state: "Enter state",
      district: "Enter district",
      pincode: "Enter pincode",
      date_of_birth: "Enter DOB (YYYY-MM-DD)",
      gender: "Enter gender (MALE/FEMALE/OTHER)",
      mobile_number: "Enter mobile number",
      email: "Enter email address",
      callback_url: "Enter callback URL",
      transaction_id: "Enter transaction ID",
      address: "Enter complete address",
    }

    return fields.map((field) => ({
      ...field,
      placeholder: placeholders[field.name] || field.placeholder,
      type: field.name === "consent" ? "radio" : field.type, // Ensure consent is radio (generic handles it, but robust here)
    }))
  }

  const transformFormData = (formData: CcrvFormData): CcrvApiPayload => {
    return formData as CcrvApiPayload;
  }

  const handleApiAction = async (serviceKey: string, payload: CcrvApiPayload) => {
    // Original code just closes dialog and sets error.
    // We can simulate this by throwing an error.
    throw new Error("Government source temporarily unavailable. Please try again later.")
  }

  return (
    <GenericVerificationSection<typeof ccrvServices[number], CcrvFormData, CcrvApiPayload>
      services={ccrvServices}
      title="CCRV Verification"
      description="Verify CCRV details"
      productId={productId}
      apiAction={handleApiAction}
      preprocessFields={preprocessFields}
      transformFormData={transformFormData}
    />
  )
}