"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { passportServices } from "../../utils/passportServices";
import { passportApi } from "../../services/api/passportApi";
import { usePricingContext } from "../../context/PricingContext";

export const PassportSection: React.FC<{ productId?: string }> = ({ productId }) => {
  const [selectedService, setSelectedService] = useState(passportServices[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get Passport pricing from backend
  const { getVerificationPricingByType } = usePricingContext();
  
  // DEBUG: Log the actual function being called
  console.log("=== PASSPORT PRICING DEBUG ===");
  console.log("Calling getVerificationPricingByType with 'passport'");
  
  const passportPricing = getVerificationPricingByType("passport");
  
  console.log("Raw result from context:", passportPricing);
  console.log("Type of result:", typeof passportPricing);
  console.log("Is it undefined?", passportPricing === undefined);
  
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
          field.name === "passport_number"
            ? "Enter passport number (e.g., Z4062176)"
            : field.name === "file_number"
              ? "Enter file number (e.g., VS3068896594915)"
            : field.name === "country_code"
              ? "Enter country code (e.g., IND)"
            : field.name === "date_of_birth"
              ? "Enter DOB (YYYY-MM-DD)"
            : field.name === "date_of_expiry"
              ? "Enter expiry date (YYYY-MM-DD)"
            : field.name === "surname"
              ? "Enter surname"
            : field.name === "given_name"
              ? "Enter given name(s)"
            : field.name === "gender"
              ? "Enter gender (MALE/FEMALE)"
            : field.name === "mrz_first_line"
              ? "Enter MRZ first line (44 characters)"
            : field.name === "mrz_second_line"
              ? "Enter MRZ second line (44 characters)"
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

      // Handle file uploads for OCR (special case)
      if (selectedService.key === "ocr" && payload.file_front) {
        // For OCR, we'll pass the file directly (handled in api layer)
        response = await passportApi.extractPassportOcrData(payload);
      } else {
        // Handle regular form fields
        if (payload.passport_number) {
          payload.passport_number = String(payload.passport_number).trim();
        }
        if (payload.file_number) {
          payload.file_number = String(payload.file_number).trim();
        }
        if (payload.country_code) {
          payload.country_code = String(payload.country_code).toUpperCase().trim();
        }
        if (payload.date_of_birth) {
          payload.date_of_birth = String(payload.date_of_birth).trim();
        }
        if (payload.date_of_expiry) {
          payload.date_of_expiry = String(payload.date_of_expiry).trim();
        }
        if (payload.surname) {
          payload.surname = String(payload.surname).trim();
        }
        if (payload.given_name) {
          payload.given_name = String(payload.given_name).trim();
        }
        if (payload.gender) {
          payload.gender = String(payload.gender).toUpperCase().trim();
        }
        if (payload.mrz_first_line) {
          payload.mrz_first_line = String(payload.mrz_first_line).trim();
        }
        if (payload.mrz_second_line) {
          payload.mrz_second_line = String(payload.mrz_second_line).trim();
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

        // Validate passport number format (varies by country but typically 6-12 chars)
        if (payload.passport_number && payload.passport_number.length < 6) {
          throw new Error("Please enter a valid passport number (minimum 6 characters)");
        }

        // Validate date formats
        if (payload.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date_of_birth)) {
          throw new Error("Please enter date of birth in YYYY-MM-DD format");
        }

        if (payload.date_of_expiry && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date_of_expiry)) {
          throw new Error("Please enter expiry date in YYYY-MM-DD format");
        }

        // Validate consent
        if (!payload.consent || !["Y", "N"].includes(payload.consent)) {
          throw new Error("Please provide consent (Yes/No)");
        }

        // Handle services
        switch (selectedService.key) {
          case "mrz-generate":
            response = await passportApi.generateMrz(payload);
            break;
          case "mrz-verify":
            response = await passportApi.verifyMrz(payload);
            break;
          case "verify":
            response = await passportApi.verifyPassport(payload);
            break;
          case "fetch":
            response = await passportApi.fetchPassportDetails(payload);
            break;
          case "ocr":
            // File upload handled in api layer
            response = await passportApi.extractPassportOcrData(payload);
            break;
          default:
            // Fallback for any new services added via dynamic routing
            response = await passportApi.post(selectedService.apiEndpoint, payload);
        }
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
      title="Passport Verification Services"
      description="International passport verification, MRZ generation, and OCR capabilities"
      services={passportServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
      {/* Display pricing if available */}
      {/* {passportPricing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Service Pricing</h3>
          <div className="flex flex-col gap-1 text-sm">
            {passportPricing.oneTimePrice !== undefined && (
              <span className="text-blue-700">
                One-time: ₹{passportPricing.oneTimePrice}
                {passportPricing.oneTimeQuota?.count ? ` • Includes ${passportPricing.oneTimeQuota.count} verification${passportPricing.oneTimeQuota.count > 1 ? 's' : ''}` : ''}
                {passportPricing.oneTimeQuota?.validityDays && passportPricing.oneTimeQuota.validityDays > 0 ? ` • valid ${passportPricing.oneTimeQuota.validityDays} days` : ''}
              </span>
            )}
            {passportPricing.monthlyPrice !== undefined && (
              <span className="text-blue-700">
                Monthly: ₹{passportPricing.monthlyPrice}
                {passportPricing.monthlyQuota?.count ? ` • Includes ${passportPricing.monthlyQuota.count} verification${passportPricing.monthlyQuota.count > 1 ? 's' : ''}` : ''}
                {passportPricing.monthlyQuota?.validityDays && passportPricing.monthlyQuota.validityDays > 0 ? ` • valid ${passportPricing.monthlyQuota.validityDays} days` : ''}
              </span>
            )}
            {passportPricing.yearlyPrice !== undefined && (
              <span className="text-blue-700">
                Yearly: ₹{passportPricing.yearlyPrice}
                {passportPricing.yearlyQuota?.count ? ` • Includes ${passportPricing.yearlyQuota.count} verification${passportPricing.yearlyQuota.count > 1 ? 's' : ''}` : ''}
                {passportPricing.yearlyQuota?.validityDays && passportPricing.yearlyQuota.validityDays > 0 ? ` • valid ${passportPricing.yearlyQuota.validityDays} days` : ''}
              </span>
            )}
          </div>
        </div>
      )} */}

      {/* DEBUG: Show what we're getting */}
      {/* {passportPricing ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm">
          <strong>DEBUG INFO:</strong> Found pricing data for passport!
          <br />
          One-time: ₹{passportPricing.oneTimePrice}
          <br />
          Monthly: ₹{passportPricing.monthlyPrice}
          <br />
          Yearly: ₹{passportPricing.yearlyPrice}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          <strong>DEBUG INFO:</strong> No pricing data found for passport
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