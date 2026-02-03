// src/pages/auth/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  loginUser,
  clearError,
  sendPasswordOtp,
  resetPasswordWithOtp,
  loginWithPhoneAndPassword,
  resetPasswordWithPhoneToken,
} from "../../redux/slices/authSlice";
import { Lock, Loader2 } from "lucide-react";
import { useToast } from "../../components/common/ToastProvider";
import AuthCardLayout from "../../components/auth/AuthCardLayout";
import registerHero from "../../assets/animations/register-hero.json";
import { formatToE164, isPhoneLike } from "../../utils/authUtils";
import { CountrySelect } from "../../components/auth/CountrySelect";
import { FormField } from "../../components/forms/FormField";
import { usePhoneAuth } from "../../hooks/usePhoneAuth";

// Validation Schemas
const loginSchema = yup.object({
  identifier: yup.string().required("Email or phone is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  dialCode: yup.string().default("91"),
});

const resetSchema = yup.object({
  identifier: yup.string().required("Email or phone is required"),
  otp: yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
  newPassword: yup.string().required("New password is required").min(6, "Password must be at least 6 characters"),
  dialCode: yup.string().default("91"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;
type ResetFormData = yup.InferType<typeof resetSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  // Reuse our clean phone auth hook
  const {
    recaptchaRef,
    sendOtp: sendPhoneHelper,
    verifyOtp: verifyPhoneToken,
    isSendingOtp: isPhoneSending
  } = usePhoneAuth("recaptcha-container");

  const [showReset, setShowReset] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Forms
  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { identifier: "", password: "", dialCode: "91" }
  });

  const resetForm = useForm<ResetFormData>({
    resolver: yupResolver(resetSchema) as any,
    defaultValues: { identifier: "", otp: "", newPassword: "", dialCode: "91" }
  });

  // Watchers for dynamic UI (country code)
  const loginIdentifier = loginForm.watch("identifier");
  const resetIdentifier = resetForm.watch("identifier");
  const isLoginPhone = isPhoneLike(loginIdentifier);
  const isResetPhone = isPhoneLike(resetIdentifier);

  // Persist dial code selection manually if needed or via form
  const loginDialCode = loginForm.watch("dialCode");
  const resetDialCode = resetForm.watch("dialCode");

  // Redirects
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('expired') === 'true') {
      showToast('Your session has expired. Please login again.', { type: 'info' });
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate, showToast]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const state = location.state as any;
      navigate(state?.redirectTo || "/", { state: state?.nextState });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  // Handlers
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const value = data.identifier.trim();
      const isEmail = !isPhoneLike(value); // Simplified check, can use validator

      let result;
      if (isEmail) {
        result = await dispatch(loginUser({ email: value, password: data.password }));
      } else {
        const e164 = formatToE164(value, data.dialCode || "91");
        result = await dispatch(loginWithPhoneAndPassword({ phone: e164, password: data.password }));
      }

      if (loginUser.fulfilled.match(result) || loginWithPhoneAndPassword.fulfilled.match(result)) {
        // navigation handled by useEffect
      } else {
        const msg = (result.payload as string) || "Login failed";
        showToast(msg, { type: 'error' });
      }
    } catch (e: any) {
      showToast(e.message || "Login failed", { type: "error" });
    }
  };

  const onRequestOtp = async () => {
    const values = resetForm.getValues();
    if (!values.identifier) {
      showToast("Please enter email or phone", { type: 'error' });
      return;
    }

    try {
      if (isResetPhone) {
        await sendPhoneHelper(values.identifier, values.dialCode || "91");
      } else {
        setIsEmailSending(true);
        await dispatch(sendPasswordOtp(values.identifier));
        showToast("OTP sent to email", { type: "success" });
        setIsEmailSending(false);
      }
    } catch (e: any) {
      setIsEmailSending(false);
      showToast("Failed to send OTP", { type: "error" });
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    try {
      if (isResetPhone) {
        // Verify Phone OTP first to get ID Token
        const idToken = await verifyPhoneToken(data.otp);
        if (idToken) {
          const result = await dispatch(resetPasswordWithPhoneToken({ idToken, newPassword: data.newPassword }));
          if (resetPasswordWithPhoneToken.fulfilled.match(result)) {
            showToast("Password updated. Please login.", { type: "success" });
            setShowReset(false);
          } else {
            showToast((result.payload as string) || "Update failed", { type: "error" });
          }
        }
      } else {
        // Email Flow
        const result = await dispatch(resetPasswordWithOtp({ email: data.identifier, otp: data.otp, newPassword: data.newPassword }));
        if (resetPasswordWithOtp.fulfilled.match(result)) {
          showToast("Password updated. Please login.", { type: "success" });
          setShowReset(false);
        } else {
          showToast((result.payload as string) || "Update failed", { type: "error" });
        }
      }
    } catch (e: any) {
      showToast("Reset failed", { type: "error" });
    }
  };

  return (
    <AuthCardLayout
      animationData={registerHero as object}
      leftHeader={
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Sign in to your account</p>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {showReset ? (
          // RESET FORM
          <FormProvider {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {isResetPhone && (
                  <div className="col-span-1">
                    <CountrySelect
                      value={resetDialCode || "91"}
                      onChange={(val) => resetForm.setValue("dialCode", val)}
                    />
                  </div>
                )}
                <div className={isResetPhone ? "col-span-4" : "col-span-5"}>
                  <FormField
                    name="identifier"
                    label="Email or Mobile"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onRequestOtp}
                  disabled={isPhoneSending || isEmailSending}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  {isPhoneSending || isEmailSending ? "Sending..." : "Send OTP"}
                </button>
              </div>

              <FormField
                name="otp"
                label="enter 6-digit OTP"
                inputMode="numeric"
                maxLength={6}
              />

              <FormField
                name="newPassword"
                label="New Password"
                type="password"
                icon={Lock}
              />

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => setShowReset(false)} className="text-sm text-gray-600">Back to Login</button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Reset Password"}
                </button>
              </div>
            </form>
          </FormProvider>
        ) : (
          // LOGIN FORM
          <FormProvider {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {isLoginPhone && (
                  <div className="col-span-1">
                    <CountrySelect
                      value={loginDialCode || "91"}
                      onChange={(val) => loginForm.setValue("dialCode", val)}
                    />
                  </div>
                )}
                <div className={isLoginPhone ? "col-span-4" : "col-span-5"}>
                  <FormField
                    name="identifier"
                    label="Email or Mobile"
                    autoComplete="username"
                  />
                </div>
              </div>

              <FormField
                name="password"
                label="Password"
                type="password"
                icon={Lock}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Sign in"}
              </button>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Don't have an account? <Link to="/register" className="font-medium text-blue-600">Sign up</Link>
                </p>
                <button type="button" onClick={() => setShowReset(true)} className="text-sm text-blue-600">Forgot password?</button>
              </div>
            </form>
          </FormProvider>
        )}
      </motion.div>
      <div id="recaptcha-container" ref={recaptchaRef} className="hidden" />
    </AuthCardLayout>
  );
};

export default LoginPage;
