"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useVerificationPricing } from "../../hooks/usePricing";
import {
    Upload,
    AlertCircle,
    Loader2,
    ShieldCheck,
    Lock,
} from "lucide-react";
import TextField from "../forms/TextField";
import { CameraInput } from "../forms/CameraInput";
import { VerificationResultShell } from "./VerificationResultShell";
import { PostVerificationReview } from "./PostVerificationReview";
import { useForm } from "react-hook-form";
import { VerificationResultRenderer } from "./VerificationResultRenderer";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormField {
    name: string;
    label: string;
    type: "text" | "file" | "json" | "radio" | "camera" | "date" | "number" | "email";
    required: boolean;
    placeholder?: string;
    options?: { label: string; value: string }[];
    accept?: string;
    pattern?: string;
    title?: string;
}

interface VerificationResult {
    success?: boolean;
    status?: string | number;
    message?: string;
    error?: string;
    status_code?: number;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    request_id?: string;
    transaction_id?: string;
    bank_account_data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface VerificationFormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
    isLoading?: boolean;
    result?: unknown;
    error?: string | null;
    serviceKey?: string;
    serviceName?: string;
    serviceDescription?: string;
    productId?: string;
    onCustomReset?: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
    fields,
    onSubmit,
    isLoading = false,
    result,
    error,
    serviceKey,
    serviceName,
    serviceDescription,
    productId,
    onCustomReset,
}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [showResult, setShowResult] = useState(false);

    // Camera refs removed as unused

    const shareTargetRef = useRef<HTMLDivElement | null>(null);

    // Generate validation schema based on fields
    const validationSchema = React.useMemo(() => {
        const shape: Record<string, yup.AnySchema> = {};

        fields.forEach((field) => {
            if (field.type === "file" || field.type === "camera") {
                let validator = yup.mixed();
                if (field.required) {
                    validator = validator.test("fileRequired", `${field.label} is required`, (value) => {
                        return !!value;
                    });
                }
                shape[field.name] = validator;
            } else if (field.type === "number") {
                let validator = yup.number().typeError(`${field.label} must be a number`);
                if (field.required) {
                    validator = validator.required(`${field.label} is required`);
                }
                shape[field.name] = validator;
            } else if (field.type === "email") {
                let validator = yup.string().email("Invalid email format");
                if (field.required) {
                    validator = validator.required(`${field.label} is required`);
                }
                shape[field.name] = validator;
            } else {
                // Default string validator
                let validator = yup.string();
                if (field.required) {
                    validator = validator.required(`${field.label} is required`);
                }
                if (field.pattern) {
                    validator = validator.matches(new RegExp(field.pattern), `Invalid format`);
                }
                shape[field.name] = validator;
            }
        });

        return yup.object().shape(shape);
    }, [fields]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<Record<string, unknown>>({
        resolver: yupResolver(validationSchema) as any,
        mode: "onChange",
    });

    // Clear form data and results when service changes
    useEffect(() => {
        setFormData({});
        setShowResult(false);
        reset();
    }, [serviceKey, reset]);

    useEffect(() => {
        if (result) {
            setShowResult(true);
            // setShowMoreDetails(false); // Removed
        } else {
            // Reset form when result is cleared (e.g., from parent component)
            setShowResult(false);
            setFormData({});
        }
    }, [result]);

    const isQuotaError = typeof error === "string" && /quota|exhaust|exhausted|limit|token/i.test(error);
    const serviceSlug = ((serviceKey || serviceName || "verification") as string)
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    // Prefer productId (e.g., pan, gstin, ...) if provided, fallback to service slug
    const verificationType = (productId || serviceSlug).toLowerCase();

    // Pull the same pricing used on the product detail page
    const { data: pricingData } = useVerificationPricing(verificationType);

    // Reuse Buy Now logic from ProductOverview: navigate to checkout with minimal required state
    const handleBuyNow = () => {
        if (pricingData && pricingData.oneTimePrice != null) {
            const oneTimePrice = Number(pricingData.oneTimePrice);
            const tierInfo = {
                service: verificationType,
                label: serviceName || verificationType.toUpperCase(),
                price: isNaN(oneTimePrice) ? 0 : oneTimePrice,
                billingPeriod: "one-time",
                originalPrice: isNaN(oneTimePrice) ? 0 : oneTimePrice,
                discount: 0,
            };
            navigate("/checkout", {
                state: {
                    selectedPlan: "one-time",
                    billingPeriod: "one-time",
                    selectedServices: [verificationType],
                    productInfo: {
                        id: verificationType,
                        title: serviceName || verificationType.toUpperCase(),
                    },
                    tierInfo,
                    totalAmount: isNaN(oneTimePrice) ? undefined : oneTimePrice,
                    returnTo: `/products/${verificationType}`,
                },
            });
        } else {
            // Fallback minimal payload
            navigate("/checkout", {
                state: {
                    selectedPlan: "one-time",
                    billingPeriod: "one-time",
                    selectedServices: [verificationType],
                    productInfo: {
                        id: verificationType,
                        title: serviceName || verificationType.toUpperCase(),
                    },
                    returnTo: `/products/${verificationType}`,
                },
            });
        }
    };

    const handleFileChange = (name: string, file: File | null) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
        setValue(name, file, { shouldValidate: true });
    };

    const handleCameraCapture = (name: string, file: File) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
        setValue(name, file, { shouldValidate: true });
    };

    const onFormSubmit = async (data: Record<string, unknown>) => {
        try {
            // Merge react-hook-form data with custom state (like files/camera)
            const mergedData = { ...data, ...formData };
            await onSubmit(mergedData);
        } catch (err) {
            console.error("Form submission error:", err);
        }
    };

    const handleReset = () => {
        setShowResult(false);
        setFormData({});
        reset();
        // Call custom reset handler if provided (for services like Aadhaar V2 that need additional state reset)
        if (onCustomReset) {
            onCustomReset();
        } else {
            window.location.reload();
        }
    };

    // function removed and replaced by component

    return (
        <div className="space-y-6">
            {/* Banner */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-5 text-white shadow-lg">
                <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="space-y-0.5 sm:space-y-1">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight">{serviceName}</h2>
                        <p className="text-blue-100 max-w-2xl text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {serviceDescription}
                        </p>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl opacity-50" />
                <div className="absolute -bottom-12 right-12 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl opacity-50" />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800">Verification Failed</h4>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        {isQuotaError && (
                            <button
                                onClick={handleBuyNow}
                                className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-800"
                            >
                                Upgrade Plan / Buy Credits
                            </button>
                        )}
                    </div>
                </div>
            )}

            {result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <VerificationResultRenderer
                        result={result}
                        serviceKey={serviceKey}
                        serviceName={serviceName}
                        serviceDescription={serviceDescription}
                        onReset={handleReset}
                    />

                    {/* Post Verification Review */}
                    {productId && (
                        <PostVerificationReview
                            productId={productId}
                            serviceName={serviceName}
                        />
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-white p-1 rounded-xl">
                    <div className="grid grid-cols-1 gap-5">
                        {fields.map((field, index) => {
                            const isTextField = field.type !== "radio" && field.type !== "file" && field.type !== "camera";

                            return (
                                <motion.div
                                    key={field.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    className="space-y-3 group"
                                >
                                    {!isTextField && (
                                        <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                    )}

                                    {field.type === "radio" ? (
                                        <div className="flex gap-6">
                                            {field.options?.map((option) => (
                                                <label key={option.value} className="flex items-center gap-3 cursor-pointer group/option">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="radio"
                                                            value={option.value}
                                                            {...register(field.name, { required: field.required })}
                                                            className="peer h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover/option:text-gray-900">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : field.type === "file" ? (
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group-focus-within:border-blue-500 group-focus-within:bg-blue-50/50">
                                            <div className="space-y-2 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label
                                                        htmlFor={field.name}
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id={field.name}
                                                            type="file"
                                                            accept={field.accept}
                                                            className="sr-only"
                                                            {...register(field.name, { required: field.required })}
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] || null;
                                                                handleFileChange(field.name, file);
                                                            }}
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                                {!!watch(field.name) && (
                                                    <p className="text-sm text-green-600 font-medium mt-2">
                                                        File selected: {(watch(field.name) as FileList)?.[0]?.name || "Selected"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : field.type === "camera" ? (
                                        <CameraInput
                                            label={field.label}
                                            onCapture={(file) => handleCameraCapture(field.name, file)}
                                            error={errors[field.name]?.message as string}
                                        />
                                    ) : (
                                        <TextField
                                            id={field.name}
                                            label={field.label}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            error={errors[field.name] ? "This field is required" : undefined}
                                            {...register(field.name, { required: field.required })}
                                        />
                                    )}

                                    {/* Only show external error for non-TextFields */}
                                    {!isTextField && errors[field.name] && (
                                        <p className="text-sm text-red-600 flex items-center gap-1.5 animate-in slide-in-from-left-1">
                                            <AlertCircle className="w-4 h-4" />
                                            This field is required
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Verifying Document...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5 mr-2" />
                                    Secure Verify
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            By verifying, you agree to our Terms of Service and Privacy Policy.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                            <Lock className="w-3 h-3" />
                            <span>256-bit SSL Encrypted Connection</span>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
