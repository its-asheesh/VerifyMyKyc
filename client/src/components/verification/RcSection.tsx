"use client";

import type React from "react";
import { rcServices } from "../../config/rcConfig";
import { vehicleApi } from "../../services/api/vehicleApi";
import { GenericVerificationSection } from "./GenericVerificationSection";

interface RcFormData {
  rc_number?: string;
  tag_id?: string;
  chassis_number?: string;
  engine_number?: string;
  extract_variant?: string | boolean;
  consent: string | boolean;
  [key: string]: unknown;
}

interface RcApiPayload {
  rc_number?: string;
  tag_id?: string;
  chassis_number?: string;
  engine_number?: string;
  extract_variant?: string | boolean;
  consent: string; // Transformed from boolean/string to "Y" | "N"
  [key: string]: any;
}

export const RcSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const transformFormData = (formData: RcFormData): RcApiPayload => {
    const payload: any = { ...formData }

    if (payload.consent === true || payload.consent === "true") {
      payload.consent = "Y";
    } else if (payload.consent === false || payload.consent === "false") {
      payload.consent = "N";
    }
    // Handle existing string "Y"/"N" or map properly
    if (typeof formData.consent === "string" && (formData.consent === "Y" || formData.consent === "N")) {
      payload.consent = formData.consent;
    } else if (typeof formData.consent === "boolean") {
      payload.consent = formData.consent ? "Y" : "N";
    }

    if (payload.rc_number) {
      payload.rc_number = String(payload.rc_number).toUpperCase().trim()
    }
    if (payload.chassis_number) {
      payload.chassis_number = String(payload.chassis_number).toUpperCase().trim()
    }
    if (payload.engine_number) {
      payload.engine_number = String(payload.engine_number).trim()
    }
    if (payload.tag_id) {
      payload.tag_id = String(payload.tag_id).toUpperCase().trim()
    }

    return payload as RcApiPayload
  }

  const handleApiAction = async (serviceKey: string, payload: RcApiPayload) => {
    switch (serviceKey) {
      case "fetch-lite":
        if (!payload.rc_number) throw new Error("RC Number is required");
        return await vehicleApi.rcFetchLite({
          rc_number: payload.rc_number,
          consent: payload.consent,
        })
      case "fetch-detailed":
        if (!payload.rc_number) throw new Error("RC Number is required");
        return await vehicleApi.rcFetchDetailed({
          rc_number: payload.rc_number,
          extract_variant: payload.extract_variant === 'true' || payload.extract_variant === true,
          consent: payload.consent as "Y" | "N",
        })
      case "fetch-detailed-challan":
        if (!payload.rc_number) throw new Error("RC Number is required");
        return await vehicleApi.rcFetchDetailedWithChallan({
          rc_number: payload.rc_number,
          extract_variant: payload.extract_variant === 'true' || payload.extract_variant === true,
          consent: payload.consent as "Y" | "N",
        })
      case "echallan-fetch":
        if (!payload.rc_number) throw new Error("RC Number is required");
        return await vehicleApi.rcFetchEChallan({
          rc_number: payload.rc_number,
          chassis_number: payload.chassis_number || "",
          engine_number: payload.engine_number || "",
          consent: payload.consent,
        })
      case "fetch-reg-num-by-chassis":
        if (!payload.chassis_number) throw new Error("Chassis Number is required");
        // Ensure strictly typed payload for this specific call if needed, or cast parts
        return await vehicleApi.rcFetchRegNumByChassis({
          chassis_number: payload.chassis_number,
          consent: payload.consent as "Y" | "N"
        })
      case "fastag-fetch-detailed":
        if (!payload.rc_number && !payload.tag_id) {
          throw new Error("Either RC Number or Tag ID is required")
        }
        return await vehicleApi.rcFetchFastagDetails(payload)
      default:
        return await vehicleApi.post(
          rcServices.find(s => s.key === serviceKey)?.apiEndpoint || "",
          payload
        )
    }
  }

  return (
    <GenericVerificationSection<typeof rcServices[number], RcFormData, RcApiPayload>
      services={rcServices}
      title="RC Verification Services"
      description="Verify Vehicle RC details instantly"
      productId={productId}
      apiAction={handleApiAction}
      transformFormData={transformFormData}
    />
  );
};