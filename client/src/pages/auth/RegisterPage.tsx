// src/pages/auth/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Lock, Building, Loader2, UserPlus } from "lucide-react";

import { useAppSelector } from "../../redux/hooks";
import AuthCardLayout from "../../components/auth/AuthCardLayout";
import { BackButton } from "../../components/common/BackButton";
import { CountrySelect } from "../../components/auth/CountrySelect";
import { FormField } from "../../components/forms/FormField";
import OtpInputWithTimer from "../../components/forms/OtpInputWithTimer";
import PasswordStrengthMeter from "../../components/forms/PasswordStrengthMeter";
import { useAuthFlow } from "../../hooks/useAuthFlow";
import { isPhoneLike } from "../../utils/authUtils";
import { isValidEmail, isValidE164Phone } from "../../utils/validators";
import { formatToE164 } from "../../utils/authUtils";
import registerHero from "../../assets/animations/register-hero.json";

// Validation Schema
const registerSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  identifier: yup.string().required("Email or mobile is required")
    .test('is-valid-contact', 'Invalid email or mobile number', function (value) {
      if (!value) return false;
      const { dialCode } = this.parent;
      if (isValidEmail(value)) return true;
      // Phone check
      if (!dialCode) return false;
      const e164 = formatToE164(value, dialCode);
      return isValidE164Phone(e164);
    }),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  company: yup.string().optional(),
  dialCode: yup.string().default("91")
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");

  const { isSendingOtp, initiateRegister, verifyOtp, resendOtp, recaptchaRef } = useAuthFlow({ onStepChange: setStep });

  const methods = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any,
    mode: "onChange",
    defaultValues: {
      dialCode: "91",
      name: "",
      identifier: "",
      password: "",
      confirmPassword: "",
      company: ""
    }
  });

  const { handleSubmit, setValue, watch } = methods;
  const control = methods.control;
  const identifier = useWatch({ control, name: "identifier" });
  const dialCode = useWatch({ control, name: "dialCode" });
  const isIdentifierPhoneLike = isPhoneLike(identifier || "");

  // Auto-login redirect
  useEffect(() => {
    if (authState.isAuthenticated) {
      const state = location.state as { redirectTo?: string; nextState?: unknown } | null;
      navigate(state?.redirectTo || "/", { state: state?.nextState });
    }
  }, [authState.isAuthenticated, navigate, location.state]);

  const onSubmitStep1 = async (data: RegisterFormData) => {
    await initiateRegister({
      name: data.name,
      identifier: data.identifier,
      password: data.password,
      company: data.company,
      dialCode: data.dialCode || "91"
    });
  };

  const handleVerifyOtp = async () => {
    const data = methods.getValues();
    await verifyOtp(otp, {
      name: data.name,
      company: data.company,
      password: data.password
    });
  };

  const goBack = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <AuthCardLayout
      animationData={registerHero as object}
      leftHeader={
        <div>
          {step > 1 && <BackButton onClick={goBack} label="Back" className="mb-2" />}
          <div className="flex justify-between mb-1 text-[10px] md:text-xs font-medium">
            <span className={step >= 1 ? "text-blue-600" : "text-gray-400"}>1. Details</span>
            <span className={step >= 2 ? "text-blue-600" : "text-gray-400"}>2. Verify</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>
      }
      rightHeader={
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent">
            {step === 1 ? "Create your account" : "Verify your account"}
          </h2>
        </div>
      }
    >
      <FormProvider {...methods}>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="hidden" id="recaptcha-container" ref={recaptchaRef} />

          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="name"
                  label="Full Name"
                  icon={User}
                  autoComplete="name"
                />
                <div className="grid grid-cols-5 gap-2">
                  {isIdentifierPhoneLike && (
                    <div className="col-span-2">
                      <CountrySelect
                        value={dialCode}
                        onChange={(code) => setValue("dialCode", code)}
                      />
                    </div>
                  )}
                  <div className={isIdentifierPhoneLike ? "col-span-3" : "col-span-5"}>
                    <FormField
                      name="identifier"
                      label="Email or Mobile"
                      autoComplete="username"
                    />
                  </div>
                </div>
              </div>

              <FormField
                name="password"
                label="Password"
                type="password"
                icon={Lock}
                autoComplete="new-password"
              />
              <PasswordStrengthMeter password={watch("password")} />

              <FormField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                icon={Lock}
                autoComplete="new-password"
              />

              <FormField
                name="company"
                label="Company (Optional)"
                icon={Building}
                autoComplete="organization"
              />

              {authState.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{authState.error}</p>
                </div>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={authState.isLoading || isSendingOtp}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create account</span>
                  </>
                )}
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We sent a verification code to{" "}
                  <span className="font-semibold">{methods.getValues("identifier")}</span>
                </p>
                <button
                  onClick={goBack}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change email/mobile
                </button>
              </div>

              <OtpInputWithTimer
                value={otp}
                onChange={setOtp}
                onResend={resendOtp}
              />

              <motion.button
                onClick={handleVerifyOtp}
                whileTap={{ scale: 0.98 }}
                disabled={authState.isLoading || otp.length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {authState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Verify & Create Account</span>
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </FormProvider>
    </AuthCardLayout>
  );
};

export default RegisterPage;
