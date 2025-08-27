"use client";

import type React from "react";
import { useState } from "react";
import { VerificationLayout } from "./VerificationLayout";
import { VerificationForm } from "./VerificationForm";
import { passportServices } from "../../utils/passportServices";
import { passportApi } from "../../services/api/passportApi";
import { usePricingContext } from "../../context/PricingContext";

export const PassportSection: React.FC<{ productId?: string }> = ({ productId }) => {
  /* -------------------------------------------------
   * State
   * -------------------------------------------------*/
  const [selectedService, setSelectedService] = useState(passportServices[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------
   * Pricing (context)
   * -------------------------------------------------*/
  const { getVerificationPricingByType } = usePricingContext();
  const passportPricing = getVerificationPricingByType("passport");

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
      if (field.type === "file") {
        return { ...field, accept: "image/*" };
      }
      const placeholders: Record<string, string> = {
        passport_number: "Enter passport number (e.g., Z4062176)",
        file_number: "Enter file number (e.g., VS3068896594915)",
        country_code: "Enter country code (e.g., IND)",
        date_of_birth: "Enter DOB (YYYY-MM-DD)",
        date_of_expiry: "Enter expiry date (YYYY-MM-DD)",
        surname: "Enter surname",
        given_name: "Enter given name(s)",
        gender: "Enter gender (MALE/FEMALE)",
        mrz_first_line: "Enter MRZ first line (44 characters)",
        mrz_second_line: "Enter MRZ second line (44 characters)",
      };
      return {
        ...field,
        placeholder: placeholders[field.name] || field.placeholder,
      };
    });

  /* -------------------------------------------------
   * File → Base64 helper
   * -------------------------------------------------*/
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
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

      // 2️⃣  Handle files → base64
      if (rawFormData.file_front) {
        payload.file_front = await fileToBase64(rawFormData.file_front);
      }
      if (rawFormData.file_back) {
        payload.file_back = await fileToBase64(rawFormData.file_back);
      }

      // 3️⃣  Copy other fields
      for (const [k, v] of Object.entries(rawFormData)) {
        if (k === "file_front" || k === "file_back") continue; // already handled
        if (typeof v === "boolean") {
          payload[k] = v ? "Y" : "N";
        } else if (typeof v === "string") {
          payload[k] = v.trim();
        } else {
          payload[k] = v;
        }
      }

      // 4️⃣  Basic validations
      if (payload.consent !== "Y") {
        throw new Error("Consent is required.");
      }

      // 5️⃣  Route to correct API
      let response;
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
          response = await passportApi.extractPassportOcrData(payload);
          break;
        default:
          response = await passportApi.post(selectedService.apiEndpoint, payload);
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
      title="Passport Verification Services"
      description="International passport verification, MRZ generation, and OCR capabilities"
      services={passportServices}
      selectedService={selectedService}
      onServiceChange={handleServiceChange}
    >
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