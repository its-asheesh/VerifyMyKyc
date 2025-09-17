"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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
    setNotification(null);
    setIsPolling(false);
    setPollingCount(0);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  /* -------------------------------------------------
   * Polling for results
   * -------------------------------------------------*/
  const pollForResult = async (transactionId: string) => {
    try {
      const response = await ccrvApi.fetchResult({ transaction_id: transactionId });
      
      console.log('CCRV Poll Result:', response);
      console.log('CCRV Status:', response.data?.ccrv_status);
      console.log('CCRV Data:', response.data?.ccrv_data);
      
      if (response.data?.ccrv_status === 'COMPLETED') {
        setIsPolling(false);
        setPollingCount(0);
        setResult(response);
        setNotification('✅ Verification completed! Results are ready.');
        console.log('CCRV Final Result:', response);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } else if (response.data?.ccrv_status === 'IN_PROGRESS') {
        setPollingCount(prev => prev + 1);
        if (pollingCount >= 20) { // Stop after 20 attempts (about 2 minutes)
          setIsPolling(false);
          setNotification('⏳ Verification is taking longer than expected. You will be notified when results are ready.');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } else {
        setIsPolling(false);
        setResult(response);
        setNotification('⚠️ Verification completed with status: ' + response.data?.ccrv_status);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    } catch (err: any) {
      console.error('Error polling for result:', err);
      setIsPolling(false);
      setNotification('❌ Error checking verification status. Please try again later.');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

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

      console.log('CCRV Frontend: Sending payload to API:', payload);

      // 4️⃣  Route to correct API
      let response;
      switch (selectedService.key) {
        case "generate-report":
          response = await ccrvApi.generateReport(payload);
          break;
        case "search":
          response = await ccrvApi.search(payload);
          break;
        default:
          response = await ccrvApi.post(selectedService.apiEndpoint, payload);
      }

      // 5️⃣  Check if we got a transaction ID and start polling
      console.log('CCRV Initial Response:', response);
      console.log('CCRV Transaction ID:', (response as any).data?.transaction_id || (response as any).transaction_id);
      console.log('CCRV Status:', (response as any).data?.ccrv_status);
      
      const transactionId = (response as any).data?.transaction_id || (response as any).transaction_id;
      if (transactionId && ((response as any).data?.ccrv_status === 'REQUESTED' || (response as any).data?.ccrv_status === 'IN_PROGRESS')) {
        setResult(response);
        setNotification('🔄 Verification initiated! Checking for results...');
        setIsPolling(true);
        setPollingCount(0);
        
        // Start polling every 6 seconds
        pollingRef.current = setInterval(() => {
          pollForResult(transactionId);
        }, 6000);
      } else {
        setResult(response);
        setNotification('✅ Verification completed immediately!');
        console.log('CCRV Immediate Result:', response);
      }
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
      {/* {ccrvPricing && (
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
      )} */}

      {/* Notification Display */}
      {notification && (
        <div className={`rounded-lg p-4 mb-6 ${
          notification.includes('✅') ? 'bg-green-50 border border-green-200' :
          notification.includes('🔄') ? 'bg-blue-50 border border-blue-200' :
          notification.includes('⏳') ? 'bg-yellow-50 border border-yellow-200' :
          notification.includes('❌') ? 'bg-red-50 border border-red-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              notification.includes('✅') ? 'text-green-800' :
              notification.includes('🔄') ? 'text-blue-800' :
              notification.includes('⏳') ? 'text-yellow-800' :
              notification.includes('❌') ? 'text-red-800' :
              'text-gray-800'
            }`}>
              {notification}
            </p>
            {isPolling && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-xs text-blue-600">Checking...</span>
              </div>
            )}
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