
"use client";

import type React from "react";
import { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { VerificationConfirmDialog } from "./VerificationConfirmDialog";
import { NoQuotaDialog } from "./NoQuotaDialog";
import { rcServices } from "../../config/rcConfig";
import { vehicleApi } from "../../services/api/vehicleApi";
// import { usePricingContext } from "../../context/PricingContext";
import { useVerificationLogic } from "../../hooks/useVerificationLogic";

interface RcFormData {
  rc_number?: string;
  tag_id?: string;
  chassis_number?: string;
  engine_number?: string;
  consent: string | boolean;
}

export const RcSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const {
    selectedService,
    isLoading,
    result,
    error,
    showConfirmDialog,
    showNoQuotaDialog,
    pendingFormData,
    handleServiceChange,
    initiateSubmit,
    closeConfirmDialog,
    closeNoQuotaDialog,
    confirmSubmit,
  } = useVerificationLogic<typeof rcServices[number], RcFormData>({
    services: rcServices,
  })

  // Get RC pricing from backend
  // const { getVerificationPricingByType } = usePricingContext()
  // const rcPricing = getVerificationPricingByType("rc")

  const getFormFields = (service: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return service.formFields.map((field: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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

  const handleConfirmSubmit = async () => {
    await confirmSubmit(async (formData: RcFormData) => {
      // Normalize payload
      const payload: any = { ...formData } // eslint-disable-line @typescript-eslint/no-explicit-any

      // Convert boolean consent to string
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N"
      }

      // Uppercase and trim RC number
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

      let response
      switch (selectedService.key) {
        case "fetch-lite":
          response = await vehicleApi.rcFetchLite({
            rc_number: payload.rc_number,
            consent: payload.consent,
          })
          break
        case "echallan-fetch":
          response = await vehicleApi.rcFetchEChallan({
            rc_number: payload.rc_number,
            chassis_number: payload.chassis_number || "", // Required by type
            engine_number: payload.engine_number || "", // Required by type
            consent: payload.consent,
          })
          break
        case "fetch-reg-num-by-chassis":
          response = await vehicleApi.rcFetchRegNumByChassis(payload)
          break
        case "fastag-fetch-detailed":
          // Ensure at least one of rc_number or tag_id is provided
          if (!payload.rc_number && !payload.tag_id) {
            throw new Error("Either RC Number or Tag ID is required")
          }
          response = await vehicleApi.rcFetchFastagDetails(payload as any) // eslint-disable-line @typescript-eslint/no-explicit-any
          break
        default:
          response = await vehicleApi.post(selectedService.apiEndpoint || "", payload)
      }
      return response
    })
  }

  return (
    <>
      <VerificationLayout
        title="RC Verification Services"
        description="Verify Vehicle RC details instantly"
        services={rcServices}
        selectedService={selectedService}
        onServiceChange={handleServiceChange as any} // eslint-disable-line @typescript-eslint/no-explicit-any
      >
        <VerificationForm
          fields={getFormFields(selectedService)}
          onSubmit={async (data: any) => initiateSubmit(data)} // eslint-disable-line @typescript-eslint/no-explicit-any
          isLoading={isLoading}
          result={result}
          error={error}
          serviceKey={selectedService.key}
          serviceName={selectedService.name}
          serviceDescription={selectedService.description}
          productId={productId}
        />
      </VerificationLayout>

      <VerificationConfirmDialog
        isOpen={showConfirmDialog}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
        serviceName={selectedService.name}
        formData={pendingFormData || {}}
        tokenCost={1}
      />

      <NoQuotaDialog
        isOpen={showNoQuotaDialog}
        onClose={closeNoQuotaDialog}
        serviceName={selectedService.name}
      />
    </>
  );
};