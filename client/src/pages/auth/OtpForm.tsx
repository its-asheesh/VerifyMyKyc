// src/components/auth/OtpForm.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, Refresh, Timer } from "@mui/icons-material";

interface OtpFormProps {
  otp: string;
  setOtp: (otp: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  onBack: () => void;
  error?: boolean;
  onResend?: () => void;
  expiryTime?: number;
  subtitle?: string;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  otp,
  setOtp,
  onVerify,
  isVerifying,
  onBack,
  error,
  onResend,
  expiryTime = 600,
  subtitle = "We sent a code to your email",
}) => {
  const [localOtp, setLocalOtp] = useState(otp);
  const [timeLeft, setTimeLeft] = useState(expiryTime);

  useEffect(() => {
    setLocalOtp(otp);
  }, [otp]);

  useEffect(() => {
    if (error && localOtp) {
      setLocalOtp("");
      setOtp("");
    }
  }, [error, localOtp, setOtp]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setLocalOtp(value);
      setOtp(value);
    }
  };

  const handleVerify = () => {
    if (localOtp.length === 6 && timeLeft > 0) {
      onVerify();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ textAlign: "center", position: "relative" }}>
      {/* Back Button */}
      <IconButton
        onClick={onBack}
        sx={{
          position: "absolute",
          left: 16,
          top: 16,
          color: "text.secondary",
        }}
      >
        <ArrowBack />
      </IconButton>

      {/* Title & Subtitle */}
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Enter 6-digit code
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitle}
      </Typography>

      {/* Timer */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 1,
          borderRadius: 1,
          bgcolor: timeLeft < 60 ? "error.light" : "background.paper",
          border: `1px solid ${timeLeft < 60 ? "error.main" : "divider"}`,
        }}
      >
        <Timer fontSize="small" color={timeLeft < 60 ? "error" : "action"} />
        <Typography
          variant="body2"
          color={timeLeft < 60 ? "error" : "text.secondary"}
          fontWeight={timeLeft < 60 ? "bold" : "normal"}
        >
          Expires in: {formatTime(timeLeft)}
        </Typography>
      </Box>

      {/* OTP Input */}
      <TextField
        value={localOtp}
        onChange={handleChange}
        placeholder="000000"
        inputProps={{
          maxLength: 6,
          style: {
            textAlign: "center",
            fontSize: "1.8rem",
            letterSpacing: "10px",
            fontWeight: "bold",
          },
        }}
        disabled={timeLeft <= 0 || isVerifying}
        error={error}
        helperText={
          timeLeft <= 0
            ? "Code expired. Please request a new one."
            : error
            ? "Invalid code. Try again."
            : ""
        }
        sx={{
          width: "100%",
          maxWidth: 240,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            },
          },
          "& .MuiInputBase-input": {
            textAlign: "center",
            fontSize: "1.8rem",
            letterSpacing: "10px",
            fontWeight: "bold",
          },
        }}
      />

      {/* Verify Button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleVerify}
        disabled={localOtp.length !== 6 || timeLeft <= 0 || isVerifying}
        sx={{
          mt: 3,
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
        {isVerifying ? (
          <>
            Verifying... <CircularProgress size={16} />
          </>
        ) : (
          "Verify Code"
        )}
      </Button>

      {/* Resend Button */}
      {(timeLeft <= 60 || error) && onResend && (
        <Button
          startIcon={<Refresh />}
          onClick={onResend}
          disabled={isVerifying}
          sx={{
            mt: 2,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.light",
              color: "white",
            },
          }}
        >
          {timeLeft <= 0 ? "Request New Code" : "Resend Code"}
        </Button>
      )}
    </Box>
  );
};