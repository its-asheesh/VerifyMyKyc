"use client";

import type React from "react";
import { useState, useEffect } from "react";
import  { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { rcServices } from "../../utils/rcServices";
import { rcApi } from "../../services/api/rcApi";
import { usePricingContext } from "../../context/PricingContext";

export const RcSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(rcServices[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get RC pricing from backend
  const { getVerificationPricingByType } = usePricingContext()
  const rcPricing = getVerificationPricingByType("vehicle")

  // Clear results when service changes
  const handleServiceChange = (service: any) => {
    setSelectedService(service);
    setResult(null);
    setError(null);
  };

  const getFormFields = (service: any) => {
    return service.formFields.map((field: any) => {
      if (field.name === "consent") {
        return {
          ...field,
          type: "radio" as const,
          options: [
            { label: "Yes", value: "Y" },
            { label: "No", value: "N" },
          ],
        };
      }
      if (field.type === "json") {
        return {
          ...field,
          placeholder: "Enter JSON payload...",
        };
      }
      return {
        ...field,
        placeholder:
          field.name === "rc_number"
            ? "Enter RC number (e.g., KA01AB1234)"
            : field.name === "chassis_number"
              ? "Enter 17-digit chassis number"
              : field.name === "engine_number"
                ? "Enter engine number"
                : field.name === "tag_id"
                  ? "Enter FASTag Tag ID"
                  : undefined,
      };
    });
  };

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;

      // Normalize payload
      const payload: any = { ...formData };

      // Convert boolean consent to string
      if (typeof payload.consent === "boolean") {
        payload.consent = payload.consent ? "Y" : "N";
      }

      // Uppercase and trim RC number
      if (payload.rc_number) {
        payload.rc_number = String(payload.rc_number).toUpperCase().trim();
      }
      if (payload.chassis_number) {
        payload.chassis_number = String(payload.chassis_number).toUpperCase().trim();
      }
      if (payload.engine_number) {
        payload.engine_number = String(payload.engine_number).trim();
      }
      if (payload.tag_id) {
        payload.tag_id = String(payload.tag_id).toUpperCase().trim();
      }

      // Validate RC number format (5–10 alphanumeric)
      if (payload.rc_number) {
        const rcRegex = /^[A-Z0-9]{5,10}$/;
        if (!rcRegex.test(payload.rc_number)) {
          throw new Error("Please enter a valid RC number (5–10 alphanumeric characters)");
        }
      }

      // Validate chassis number (17 chars)
      if (payload.chassis_number && payload.chassis_number.length !== 17) {
        throw new Error("Chassis number must be exactly 17 characters");
      }

      // Validate consent
      if (!payload.consent || !["Y", "N"].includes(payload.consent)) {
        throw new Error("Please provide consent (Yes/No)");
      }

      // Handle services
      switch (selectedService.key) {
        case "fetch-lite":
          response = await rcApi.fetchLite(payload);
          break;
        case "fetch-detailed":
          response = await rcApi.fetchDetailed(payload);
          break;
        case "fetch-detailed-challan":
          response = await rcApi.fetchDetailedWithChallan(payload);
          break;
        case "echallan-fetch":
          response = await rcApi.fetchEChallan(payload);
          break;
        case "fetch-reg-num-by-chassis":
          response = await rcApi.fetchRegNumByChassis(payload);
          break;
        case "fastag-fetch-detailed":
          // Ensure at least one of rc_number or tag_id is provided
          if (!payload.rc_number && !payload.tag_id) {
            throw new Error("Either RC Number or Tag ID is required");
          }
          response = await rcApi.fetchFastagDetails(payload);
          break;
        default:
          // Fallback for any new services added via dynamic routing
          response = await rcApi.post(selectedService.apiEndpoint, payload);
      }

      setResult(response);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VerificationLayout
      title="Vehicle Verification Services"
      description="Comprehensive vehicle RC, challan, and FASTag verification services"
      services={rcServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Display pricing if available */}
      {/* {rcPricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-blue-700">
              One-time: ₹{rcPricing.oneTimePrice}
              {rcPricing.oneTimeQuota?.count ? ` • Includes ${rcPricing.oneTimeQuota.count} verification${rcPricing.oneTimeQuota.count > 1 ? 's' : ''}` : ''}
              {rcPricing.oneTimeQuota?.validityDays && rcPricing.oneTimeQuota.validityDays > 0 ? ` • valid ${rcPricing.oneTimeQuota.validityDays} days` : ''}
            </span>
            <span className="text-blue-700">
              Monthly: ₹{rcPricing.monthlyPrice}
              {rcPricing.monthlyQuota?.count ? ` • Includes ${rcPricing.monthlyQuota.count} verification${rcPricing.monthlyQuota.count > 1 ? 's' : ''}` : ''}
              {rcPricing.monthlyQuota?.validityDays && rcPricing.monthlyQuota.validityDays > 0 ? ` • valid ${rcPricing.monthlyQuota.validityDays} days` : ''}
            </span>
            <span className="text-blue-700">
              Yearly: ₹{rcPricing.yearlyPrice}
              {rcPricing.yearlyQuota?.count ? ` • Includes ${rcPricing.yearlyQuota.count} verification${rcPricing.yearlyQuota.count > 1 ? 's' : ''}` : ''}
              {rcPricing.yearlyQuota?.validityDays && rcPricing.yearlyQuota.validityDays > 0 ? ` • valid ${rcPricing.yearlyQuota.validityDays} days` : ''}
            </span>
          </div>
        </div>
      )} */}

      <VerificationForm
        fields={getFormFields(selectedService)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        result={result}
        error={error}
        serviceKey={selectedService.key}
        serviceName={selectedService.name}
        serviceDescription={selectedService.description}
        productId={productId}
      />
    </VerificationLayout>
  );
};