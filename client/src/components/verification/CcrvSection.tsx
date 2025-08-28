"use client";

import type React from "react";
import { useState } from "react";
import { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { ccrvServices } from "../../utils/ccrvServices";
import { ccrvApi } from "../../services/api/ccrvApi";
import { usePricingContext } from "../../context/PricingContext";

export const CCRVSection: React.FC<{ productId?: string }> = ({ productId }) => {
  /* -------------------------------------------------
   * State
   * -------------------------------------------------*/
  const [selectedService, setSelectedService] = useState(ccrvServices[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------
   * Pricing (context)
   * -------------------------------------------------*/
  const { getVerificationPricingByType } = usePricingContext();
  const ccrvPricing = getVerificationPricingByType("ccrv");

  /* -------------------------------------------------
   * Service switch handler
   * -------------------------------------------------*/
  const handleServiceChange = (service: any) => {
    setSelectedService(service);
    setResult(null);
    setError(null);
  };

  /* -------------------------------------------------
   * Helpers
   * -------------------------------------------------*/
  const getFormFields = (service: any) =>
    service.formFields.map((field: any) => {
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
      if (field.type === "select") {
        return {
          ...field,
          placeholder: field.placeholder || "Select option"
        };
      }
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
      };
      return {
        ...field,
        placeholder: placeholders[field.name] || field.placeholder,
      };
    });

  /* -------------------------------------------------
   * Submit
   * -------------------------------------------------*/
  const handleSubmit = async (rawFormData: any) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1️⃣  Build clean payload
      const payload: any = {};

      // 2️⃣  Copy all fields
      for (const [k, v] of Object.entries(rawFormData)) {
        if (typeof v === "boolean") {
          payload[k] = v ? "Y" : "N";
        } else if (typeof v === "string") {
          payload[k] = v.trim();
        } else {
          payload[k] = v;
        }
      }

      // 3️⃣  Basic validations
      if (payload.consent !== "Y") {
        throw new Error("Consent is required.");
      }

      // 4️⃣  Route to correct API
      let response;
      switch (selectedService.key) {
        case "generate-report":
          response = await ccrvApi.generateReport(payload);
          break;
        case "fetch-result":
          response = await ccrvApi.fetchResult(payload);
          break;
        case "search":
          response = await ccrvApi.search(payload);
          break;
        default:
          response = await ccrvApi.post(selectedService.apiEndpoint, payload);
      }

      setResult(response);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------
   * Render
   * -------------------------------------------------*/
  return (
    <VerificationLayout
      title="Criminal Case Record Verification (CCRV)"
      description="Comprehensive criminal background check and case record verification"
      services={ccrvServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Display pricing if available */}
      {ccrvPricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-blue-700">
              One-time: ₹{ccrvPricing.oneTimePrice}
              {ccrvPricing.oneTimeQuota?.count ? ` • Includes ${ccrvPricing.oneTimeQuota.count} verification${ccrvPricing.oneTimeQuota.count > 1 ? 's' : ''}` : ''}
              {ccrvPricing.oneTimeQuota?.validityDays && ccrvPricing.oneTimeQuota.validityDays > 0 ? ` • valid ${ccrvPricing.oneTimeQuota.validityDays} days` : ''}
            </span>
            <span className="text-blue-700">
              Monthly: ₹{ccrvPricing.monthlyPrice}
              {ccrvPricing.monthlyQuota?.count ? ` • Includes ${ccrvPricing.monthlyQuota.count} verification${ccrvPricing.monthlyQuota.count > 1 ? 's' : ''}` : ''}
              {ccrvPricing.monthlyQuota?.validityDays && ccrvPricing.monthlyQuota.validityDays > 0 ? ` • valid ${ccrvPricing.monthlyQuota.validityDays} days` : ''}
            </span>
            <span className="text-blue-700">
              Yearly: ₹{ccrvPricing.yearlyPrice}
              {ccrvPricing.yearlyQuota?.count ? ` • Includes ${ccrvPricing.yearlyQuota.count} verification${ccrvPricing.yearlyQuota.count > 1 ? 's' : ''}` : ''}
              {ccrvPricing.yearlyQuota?.validityDays && ccrvPricing.yearlyQuota.validityDays > 0 ? ` • valid ${ccrvPricing.yearlyQuota.validityDays} days` : ''}
            </span>
          </div>
        </div>
      )}

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