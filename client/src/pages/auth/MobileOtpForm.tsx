// src/components/auth/MobileOtpForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form"; // ✅ Removed unused 'Controller'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Reusable Components
import { OtpForm } from "./OtpForm";
import { AuthCardLayout } from "./AuthCardLayout";
import { AuthErrorAlert } from "./AuthErrorAlert";

// ✅ MUI
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Box,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";
import { ArrowBack, Phone } from "@mui/icons-material"; // ✅ Removed unused 'Flag'

// ✅ Zod Schema
const phoneSchema = z.object({
  phone: z.string().regex(/^\+91\d{10}$/, "Please enter a valid 10-digit Indian phone number"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface MobileOtpFormProps {
  onBack: () => void;
  onSendOtp: (phone: string) => Promise<void>;
  onVerifyOtp: (phone: string, otp: string) => Promise<void>;
  isSendingOtp: boolean;
  isVerifyingOtp: boolean;
  sendOtpError?: string | null;
  verifyOtpError?: string | null;
  standalone?: boolean;
}

export const MobileOtpForm: React.FC<MobileOtpFormProps> = ({
  onBack,
  onSendOtp,
  onVerifyOtp,
  isSendingOtp,
  isVerifyingOtp,
  sendOtpError,
  verifyOtpError,
  standalone = true,
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  // Watch full phone value
  const fullPhone = watch("phone");

  // ✅ Removed unused 'handlePhoneChange' function

  const onSubmitPhone = (data: PhoneFormData) => {
    setPhone(data.phone);
    onSendOtp(data.phone).then(() => setStep("otp"));
  };

  const handleVerifyOtp = () => {
    onVerifyOtp(phone, otp);
  };

  const errorMessage = errors.phone?.message || sendOtpError || verifyOtpError || "";

  // ✅ Render content without wrapper if embedded
  const content = (
    <>
      <IconButton
        onClick={step === "phone" ? onBack : () => setStep("phone")}
        sx={{ position: "absolute", left: 16, top: 16 }}
      >
        <ArrowBack />
      </IconButton>

      <AuthErrorAlert message={errorMessage} />

      {step === "phone" && (
        <>
          {/* ✅ Essential: reCAPTCHA container (invisible) */}
          <div id="recaptcha-container" style={{ display: "none" }} />

          <form onSubmit={handleSubmit(onSubmitPhone)}>
            <FormControl fullWidth error={!!errors.phone}>
              <TextField
                value={fullPhone.replace('+91', '')} // Only show digits
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  const full = `+91${digits}`;
                  setValue("phone", full, { shouldValidate: true });
                  setPhone(full);
                }}
                placeholder="80771 90206"
                inputProps={{
                  maxLength: 10,
                  style: { fontSize: "1rem" },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <Box
                          component="img"
                          src="https://flagcdn.com/w20/in.png"
                          alt="India"
                          sx={{
                            width: 20,
                            height: 14,
                            mr: 0.5,
                            borderRadius: 0.5,
                            border: "1px solid #ddd",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          +91
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    },
                  },
                }}
              />
              {errors.phone && (
                <FormHelperText error>{errors.phone.message}</FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSendingOtp || !fullPhone || fullPhone.length !== 13}
              startIcon={<Phone />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                },
              }}
            >
              {isSendingOtp ? (
                <>
                  Sending OTP... <CircularProgress size={16} />
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        </>
      )}

      {step === "otp" && (
        <OtpForm
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          isVerifying={isVerifyingOtp}
          onBack={() => setStep("phone")}
          error={!!verifyOtpError}
          onResend={() => onSendOtp(phone)}
          expiryTime={600}
          subtitle="We sent a code to your phone"
        />
      )}
    </>
  );

  if (!standalone) {
    return content;
  }

  return (
    <AuthCardLayout
      title={step === "phone" ? "Mobile OTP" : "Verify OTP"}
      subtitle={
        step === "phone"
          ? "Enter your phone number to receive an OTP"
          : "Enter the 6-digit code sent to your phone"
      }
      icon={<Phone />}
    >
      {content}
    </AuthCardLayout>
  );
};