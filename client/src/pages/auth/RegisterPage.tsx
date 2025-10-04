import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  registerUser,
  sendEmailOtp,
  verifyEmailOtp,
  clearError,
  verifyPhoneOtp,
  fetchUserProfile,
} from "../../redux/slices/authSlice";
import {
  Eye,
  EyeOff,
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, pendingEmail } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();

  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [otp, setOtp] = useState("");

  // Phone auth states
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Helper function to format phone number to E.164
  const formatToE164 = (phone: string, countryCode: string = "91"): string => {
    const digitsOnly = phone.replace(/\D/g, "");

    if (phone.startsWith("+")) {
      return phone;
    }

    if (digitsOnly.startsWith(countryCode)) {
      return `+${digitsOnly}`;
    }

    if (digitsOnly.length === 10 && countryCode === "91") {
      return `+${countryCode}${digitsOnly}`;
    }

    if (
      digitsOnly.startsWith("0") &&
      digitsOnly.length === 11 &&
      countryCode === "91"
    ) {
      return `+${countryCode}${digitsOnly.substring(1)}`;
    }

    return `+${countryCode}${digitsOnly}`;
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");
    setPhone(cleaned);

    if (formErrors.phone) {
      setFormErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validatePhone = () => {
    if (!phone) {
      showToast("Please enter a phone number", { type: "error" });
      return false;
    }

    const e164Phone = formatToE164(phone);
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(e164Phone)) {
      showToast("Please enter a valid phone number", { type: "error" });
      return false;
    }

    return true;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as any)?.redirectTo;
      const nextState = (location.state as any)?.nextState;
      if (redirectTo) {
        navigate(redirectTo, { state: nextState });
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, location.state]);

  // Show toast if redirected with a message
  useEffect(() => {
    const message = (location.state as any)?.message;
    if (message) {
      showToast(message, { type: "info" });
    }
  }, [location.state, showToast]);

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    if (authMethod === "phone" && recaptchaRef.current) {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
            // reCAPTCHA solved
          },
        }
      );
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, [authMethod]);

  const validateEmailForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.phone &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendPhoneOtp = async () => {
    if (!validatePhone()) return;

    setIsSendingPhoneOtp(true);
    try {
      const e164Phone = formatToE164(phone);
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        e164Phone,
        appVerifier
      );
      setConfirmationResult(confirmation);
      showToast("OTP sent to your phone!", { type: "success" });
    } catch (error: any) {
      console.error("Phone OTP error:", error);
      let message = "Failed to send OTP. Please try again.";
      if (error.code === "auth/invalid-phone-number") {
        message =
          "Invalid phone number format. Please enter a valid number with country code (e.g., +919876543210)";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many requests. Please wait before trying again.";
      }
      showToast(message, { type: "error" });
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

const handleVerifyPhoneOtp = async () => {
  if (!phoneOtp || phoneOtp.length < 4) {
    showToast("Please enter the OTP", { type: "error" });
    return;
  }

  setIsVerifyingPhoneOtp(true);
  try {
    if (!confirmationResult || !confirmationResult.verificationId) {
      showToast("No verification ID found. Please request a new OTP.", { type: "error" });
      setConfirmationResult(null);
      return;
    }

    const credential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      phoneOtp
    );
    const userCredential = await signInWithCredential(auth, credential);
    const idToken = await userCredential.user.getIdToken();

    const result = await dispatch(
      verifyPhoneOtp({
        idToken,
        name: formData.name || `User ${phone.slice(-4)}`,
        company: formData.company,
      })
    );

    if (verifyPhoneOtp.fulfilled.match(result)) {
      showToast("Account created successfully!", { type: "success" });
      
        navigate("/");
      }

  } catch (error: any) {
    console.error("Phone verification error:", error);
    let message = "Invalid OTP or registration failed";
    if (error.code === "auth/code-expired") {
      message = "OTP has expired. Please request a new one.";
    } else if (error.code === "auth/invalid-verification-code") {
      message = "Invalid OTP code";
    }
    showToast(message, { type: "error" });
  } finally {
    setIsVerifyingPhoneOtp(false);
  }
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMethod === "email") {
      if (validateEmailForm()) {
        const { confirmPassword, ...registerData } = formData;
        const result = await dispatch(registerUser(registerData));

        if (registerUser.rejected.match(result)) {
          showToast(result.payload as string, { type: "error" });
        }
      }
    } else {
      handleSendPhoneOtp();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">Join VerifyMyKyc today</p>

          {/* Auth Method Toggle */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setAuthMethod("email")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                authMethod === "email"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Mail className="inline mr-1 h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => setAuthMethod("phone")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                authMethod === "phone"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Smartphone className="inline mr-1 h-4 w-4" />
              Phone
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10"
        >
          {pendingEmail ? (
            // Email OTP verification
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!otp || otp.length < 4) return;
                await dispatch(verifyEmailOtp({ email: pendingEmail, otp }));
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP sent to {pendingEmail}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="6-digit code"
                />
                <div className="mt-2 text-sm">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => dispatch(sendEmailOtp(pendingEmail))}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </button>
              </div>
            </form>
          ) : authMethod === "phone" && confirmationResult ? (
            // Phone OTP verification
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyPhoneOtp();
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP sent to +{phone}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={phoneOtp}
                  onChange={(e) =>
                    setPhoneOtp(e.target.value.replace(/\D/g, ""))
                  }
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="6-digit code"
                />
                <div className="mt-2 text-sm">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={handleSendPhoneOtp}
                    disabled={isSendingPhoneOtp}
                  >
                    {isSendingPhoneOtp ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isVerifyingPhoneOtp}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isVerifyingPhoneOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Phone"
                  )}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmationResult(null);
                    setPhoneOtp("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Back to phone input
                </button>
              </div>
            </form>
          ) : authMethod === "phone" ? (
            // Phone number input
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone Field */}
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
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Company Field */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSendingPhoneOtp}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSendingPhoneOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP to Phone"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    state={location.state as any}
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* reCAPTCHA container (invisible) */}
              <div
                id="recaptcha-container"
                ref={recaptchaRef}
                className="hidden"
              />
            </form>
          ) : (
            // Email registration form
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.password
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`appearance-none relative block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Company Field */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                  {error.toLowerCase().includes("already exists") && (
                    <div className="text-sm mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/login", {
                            state: {
                              message:
                                "Email already exists. Please sign in or reset your password.",
                            },
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        Go to Login
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await dispatch(sendEmailOtp(formData.email));
                          navigate("/login", {
                            state: {
                              message: "We sent you a password reset OTP.",
                            },
                          });
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    state={location.state as any}
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;