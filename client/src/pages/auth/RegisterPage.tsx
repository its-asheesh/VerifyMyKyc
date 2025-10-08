// src/pages/auth/RegisterPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  registerUser,
  sendEmailOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
} from "../../redux/slices/authSlice";
import {
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Loader2,
  Smartphone,
} from "lucide-react";
import { useToast } from "../../components/common/ToastProvider";
import { auth } from "../../lib/firebaseClient";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import TextField from "../../components/forms/TextField";
import OtpInputWithTimer from "../../components/forms/OtpInputWithTimer";
import PasswordStrengthMeter from "../../components/forms/PasswordStrengthMeter";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  // Step 2
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 3
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | undefined>(
    undefined
  );
  const [pendingPhone, setPendingPhone] = useState<string | undefined>(
    undefined
  );
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Auto-login
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as any)?.redirectTo || "/";
      navigate(redirectTo, { state: (location.state as any)?.nextState });
    }
  }, [isAuthenticated, navigate, location.state]);

  // reCAPTCHA cleanup
  useEffect(() => {
    if (step === 2 && authMethod === "phone") {
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, [step, authMethod]);

  const formatToE164 = (phone: string, countryCode = "91"): string => {
    const digits = phone.replace(/\D/g, "");
    if (phone.startsWith("+")) return phone;
    if (digits.startsWith(countryCode)) return `+${digits}`;
    if (digits.length === 10 && countryCode === "91")
      return `+${countryCode}${digits}`;
    if (digits.startsWith("0") && digits.length === 11 && countryCode === "91")
      return `+${countryCode}${digits.substring(1)}`;
    return `+${countryCode}${digits}`;
  };

  const safeSet = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: any
  ) => {
    if (typeof value === "string") {
      setter(value);
    } else {
      console.warn("Attempted to set non-string value:", value);
      setter("");
    }
  };

  const handleContinueStep1 = () => {
    if (!name.trim() || name.trim().length < 2) {
      showToast("Name is required (min 2 characters)", { type: "error" });
      return;
    }
    setStep(2);
  };

  const validateStep2 = () => {
    if (authMethod === "email") {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        showToast("Please enter a valid email", { type: "error" });
        return false;
      }
    } else {
      if (!phone) {
        showToast("Please enter a phone number", { type: "error" });
        return false;
      }
      const e164 = formatToE164(phone);
      if (!/^\+[1-9]\d{1,14}$/.test(e164)) {
        showToast("Invalid phone number", { type: "error" });
        return false;
      }
    }

    if (!password || password.length < 6) {
      showToast("Password must be at least 6 characters", { type: "error" });
      return false;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", { type: "error" });
      return false;
    }

    return true;
  };

  const handleSendOtp = async () => {
    if (!validateStep2()) return;

    if (authMethod === "email") {
      const result = await dispatch(
        registerUser({ name, email, password, company })
      );
      if (registerUser.fulfilled.match(result)) {
        setPendingEmail(email);
        setStep(3);
      }
    } else {
      try {
        const e164Phone = formatToE164(phone);
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(
          auth,
          e164Phone,
          appVerifier
        );
        setConfirmationResult(confirmation);
        setPendingPhone(e164Phone);
        setStep(3);
      } catch (err: any) {
        let msg = "Failed to send OTP";
        if (err.code === "auth/invalid-phone-number")
          msg = "Invalid phone number";
        showToast(msg, { type: "error" });
      }
    }
  };

  // In RegisterPage.tsx
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showToast("Please enter a 6-digit OTP", { type: "error" });
      return;
    }

    if (pendingEmail) {
      await dispatch(verifyEmailOtp({ email: pendingEmail, otp }));
    } else if (pendingPhone && confirmationResult) {
      try {
        const credential = PhoneAuthProvider.credential(
          confirmationResult.verificationId,
          otp
        );
        const userCredential = await signInWithCredential(auth, credential);
        const idToken = await userCredential.user.getIdToken();

        // ✅ Include password in the payload for phone registration
        await dispatch(
          verifyPhoneOtp({
            idToken,
            name,
            company,
            password, // This will be the password collected in step 2
          })
        );
      } catch (err) {
        showToast("Invalid OTP", { type: "error" });
      }
    }
  };

  const handleResendOtp = async () => {
    if (pendingEmail) {
      await dispatch(sendEmailOtp(pendingEmail));
    } else if (pendingPhone) {
      try {
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(
          auth,
          pendingPhone,
          appVerifier
        );
        setConfirmationResult(confirmation);
      } catch (err) {
        showToast("Failed to resend OTP", { type: "error" });
      }
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
      setOtp("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-xs font-medium">
            <span className={step >= 1 ? "text-blue-600" : "text-gray-400"}>
              1. Name
            </span>
            <span className={step >= 2 ? "text-blue-600" : "text-gray-400"}>
              2. Auth
            </span>
            <span className={step >= 3 ? "text-blue-600" : "text-gray-400"}>
              3. Verify
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1
              ? "Tell us about you"
              : step === 2
              ? "Choose your sign-up method"
              : "Verify your account"}
          </h2>
          <p className="text-gray-600">
            {step === 1
              ? "Start with your name"
              : step === 2
              ? "Secure your account"
              : `Enter the OTP sent to ${pendingEmail || pendingPhone}`}
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10"
        >
          {step === 1 && (
            <div className="space-y-6">
              <TextField
                label="Full Name"
                id="name"
                value={name}
                onChange={(val) => safeSet(setName, val)}
                icon={User}
                required
                autoComplete="name"
              />
              <TextField
                label="Company (Optional)"
                id="company"
                value={company}
                onChange={(val) => safeSet(setCompany, val)}
                icon={Building}
                autoComplete="organization"
              />
              <button
                type="button"
                onClick={handleContinueStep1}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setAuthMethod("email")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    authMethod === "email"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Mail className="inline mr-1 h-4 w-4" /> Email
                </button>
                <button
                  onClick={() => setAuthMethod("phone")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    authMethod === "phone"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Smartphone className="inline mr-1 h-4 w-4" /> Phone
                </button>
              </div>

              {authMethod === "email" ? (
                <TextField
                  label="Email address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(val) => safeSet(setEmail, val)}
                  icon={Mail}
                  required
                  autoComplete="email"
                />
              ) : (
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        safeSet(setPhone, e.target.value.replace(/[^\d+]/g, ""))
                      }
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g. +919876543210"
                    />
                  </div>
                </div>
              )}

              <TextField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(val) => safeSet(setPassword, val)}
                icon={Lock}
                required
                autoComplete="new-password"
              />
              <PasswordStrengthMeter password={password} />

              <TextField
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(val) => safeSet(setConfirmPassword, val)}
                icon={Lock}
                required
                autoComplete="new-password"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <OtpInputWithTimer
                value={otp}
                onChange={(val) => safeSet(setOtp, val)}
                onResend={handleResendOtp}
                error={error}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Sign Up"}
              </button>
              <button
                type="button"
                onClick={goBack}
                className="w-full text-sm text-blue-600 hover:text-blue-700"
              >
                ← Change email/phone
              </button>
            </div>
          )}

          <div id="recaptcha-container" ref={recaptchaRef} className="hidden" />
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
