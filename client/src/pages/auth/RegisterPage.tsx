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
  Lock,
  User,
  Building,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useToast } from "../../components/common/ToastProvider";
import { auth } from "../../lib/firebaseClient";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import type { ConfirmationResult } from "firebase/auth";
import TextField from "../../components/forms/TextField";
import { isValidEmail, isValidE164Phone } from "../../utils/validators";
import OtpInputWithTimer from "../../components/forms/OtpInputWithTimer";
import PasswordStrengthMeter from "../../components/forms/PasswordStrengthMeter";
import AuthCardLayout from "../../components/auth/AuthCardLayout";
import registerHero from "../../assets/animations/register-hero.json";
import { BackButton } from "../../components/common/BackButton";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 (Details)
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or phone in one field
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [selectedDialCode, setSelectedDialCode] = useState<string>("91"); // Default India
  const [isPhoneLike, setIsPhoneLike] = useState<boolean>(false);

  // Step 2 (Verify)
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | undefined>(
    undefined
  );
  const [pendingPhone, setPendingPhone] = useState<string | undefined>(
    undefined
  );
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Auto-login
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as { redirectTo?: string; nextState?: unknown } | null;
      const redirectTo = state?.redirectTo || "/";
      navigate(redirectTo, { state: state?.nextState });
    }
  }, [isAuthenticated, navigate, location.state]);

  // reCAPTCHA cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  // Simple country dialing code options (extend as needed)
  const DIAL_CODES: Array<{ code: string; label: string }> = [
    { code: "91", label: "+91 (IN)" },
    { code: "1", label: "+1 (US)" },
    { code: "44", label: "+44 (UK)" },
    { code: "61", label: "+61 (AU)" },
    { code: "65", label: "+65 (SG)" },
    { code: "971", label: "+971 (AE)" },
  ];

  // Detect if identifier is phone-like to show country selector
  useEffect(() => {
    const val = (identifier || "").trim();
    const looksLikePhone = /^\+?\d[\d\s-]*$/.test(val) && !val.includes("@");
    setIsPhoneLike(looksLikePhone);
  }, [identifier]);

  const formatToE164 = (phone: string, countryCode = "91"): string => {
    const input = (phone || "").trim();
    if (input.startsWith("+")) return input;
    let digits = input.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");
    if (digits.length === 10) {
      return `+${countryCode}${digits}`;
    }
    if (digits.startsWith(countryCode) && digits.length > countryCode.length) {
      while (digits.startsWith(countryCode + countryCode)) {
        digits = digits.slice(countryCode.length);
      }
      return `+${digits}`;
    }
    return `+${countryCode}${digits}`;
  };

  const safeSet = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: unknown
  ) => {
    if (typeof value === "string") {
      setter(value);
    } else {
      console.warn("Attempted to set non-string value:", value);
      setter("");
    }
  };

  // No explicit continue; we submit details to send OTP directly

  const validateStep2 = () => {
    const trimmed = identifier.trim();
    const looksLikeEmail = isValidEmail(trimmed);
    let looksLikePhone = false;
    let e164Candidate = "";
    if (!looksLikeEmail) {
      e164Candidate = formatToE164(trimmed, selectedDialCode);
      looksLikePhone = isValidE164Phone(e164Candidate);
    }

    if (!looksLikeEmail && !looksLikePhone) {
      showToast("Enter a valid email or mobile number", { type: "error" });
      return false;
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
    setIsSendingOtp(true);

    const trimmed = identifier.trim();
    const isEmail = isValidEmail(trimmed);

    if (isEmail) {
      const result = await dispatch(
        registerUser({ name, email: trimmed, password, company })
      );
      if (registerUser.fulfilled.match(result)) {
        setPendingEmail(trimmed);
        setStep(2);
      }
      setIsSendingOtp(false);
      return;
    }

    // Phone flow
    try {
      const e164Phone = formatToE164(trimmed, selectedDialCode);
      let appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
        try { window.recaptchaVerifier.render?.(); } catch {
          // ignore
        }
        appVerifier = window.recaptchaVerifier;
      }
      const confirmation = await signInWithPhoneNumber(
        auth,
        e164Phone,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setPendingPhone(e164Phone);
      setStep(2);
    } catch (err: unknown) {
      let msg = "Failed to send OTP";
      if ((err as { code?: string }).code === "auth/invalid-phone-number") msg = "Invalid phone number";
      showToast(msg, { type: "error" });
    } finally {
      setIsSendingOtp(false);
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
      } catch {
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
      } catch {
        showToast("Failed to resend OTP", { type: "error" });
      }
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp("");
    }
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
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        {/* Title moved to rightHeader to align with progress bar; back button moved to header */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                id="name"
                value={name}
                onValueChange={(val) => safeSet(setName, val)}
                icon={User}
                required
                autoComplete="name"
              />
              <div className="grid grid-cols-5 gap-2">
                {isPhoneLike && (
                  <div className="col-span-2">
                    <label htmlFor="dialCode" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      id="dialCode"
                      value={selectedDialCode}
                      onChange={(e) => setSelectedDialCode(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                    >
                      {DIAL_CODES.map((o) => (
                        <option key={o.code} value={o.code}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={isPhoneLike ? "col-span-3" : "col-span-5"}>
                  <TextField
                    label="Email or Mobile"
                    id="identifier"
                    value={identifier}
                    onValueChange={(val) => safeSet(setIdentifier, val)}
                    autoComplete="username"
                  />
                </div>
              </div>
            </div>

            <TextField
              label="Password"
              id="password"
              type="password"
              value={password}
              onValueChange={(val) => safeSet(setPassword, val)}
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
              onValueChange={(val) => safeSet(setConfirmPassword, val)}
              icon={Lock}
              required
              autoComplete="new-password"
            />

            <TextField
              label="Company (Optional)"
              id="company"
              value={company}
              onValueChange={(val) => safeSet(setCompany, val)}
              icon={Building}
              autoComplete="organization"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOtp}
              disabled={isLoading || isSendingOtp}
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
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="mt-12 md:mt-12">
              <OtpInputWithTimer
                value={otp}
                onChange={(val) => safeSet(setOtp, val)}
                onResend={handleResendOtp}
                error={error}
              />
            </div>
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
    </AuthCardLayout>
  );
};

export default RegisterPage;
