// src/pages/auth/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  loginUser,
  clearError,
  sendPasswordOtp,
  resetPasswordWithOtp,
  loginWithPhoneAndPassword,
  resetPasswordWithPhoneToken,
} from "../../redux/slices/authSlice";
import {
  Lock,
  Loader2,
} from "lucide-react";
import { useToast } from "../../components/common/ToastProvider";
import TextField from "../../components/forms/TextField";
import { isValidEmail, isValidE164Phone } from "../../utils/validators";
import AuthCardLayout from "../../components/auth/AuthCardLayout";
import registerHero from "../../assets/animations/register-hero.json";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();

  const [showReset, setShowReset] = useState(false);

  // Login form
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<{
    field?: string;
    message?: string;
  }>({});
  const [selectedDialCode, setSelectedDialCode] = useState<string>("91");
  const [isPhoneLike, setIsPhoneLike] = useState<boolean>(false);

  // Reset form
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isPhoneFlow, setIsPhoneFlow] = useState(false);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [phoneConfirmation, setPhoneConfirmation] = useState<any>(null);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [selectedResetDialCode, setSelectedResetDialCode] = useState<string>("91");
  const [isResetPhoneLike, setIsResetPhoneLike] = useState<boolean>(false);

  // Redirect if authenticated

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = (location.state as any)?.redirectTo || "/";
      navigate(redirectTo, { state: (location.state as any)?.nextState });
    }
    console.log('Auth state:', { isAuthenticated, user });
  }, [isAuthenticated, user, navigate, location.state]);


  useEffect(() => {
    const message = (location.state as any)?.message;
    if (message) showToast(message, { type: "info" });
  }, [location.state, showToast]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Simple dialing codes (extend as needed)
  const DIAL_CODES: Array<{ code: string; label: string }> = [
    { code: "91", label: "+91 (IN)" },
    { code: "1", label: "+1 (US)" },
    { code: "44", label: "+44 (UK)" },
    { code: "61", label: "+61 (AU)" },
    { code: "65", label: "+65 (SG)" },
    { code: "971", label: "+971 (AE)" },
  ];

  // Utility: format to E.164 using selected dial code
  const formatToE164 = (raw: string, countryCode = "91"): string => {
    const input = (raw || "").trim();
    if (input.startsWith("+")) return input;
    let digits = input.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");
    // Heuristic: if 10-digit local number, prefix selected country code
    if (digits.length === 10) {
      return `+${countryCode}${digits}`;
    }
    // If user typed country code already and then the local number
    if (digits.startsWith(countryCode) && digits.length > countryCode.length) {
      // Collapse duplicated country code if present (e.g., 9191...)
      while (digits.startsWith(countryCode + countryCode)) {
        digits = digits.slice(countryCode.length);
      }
      return `+${digits}`;
    }
    return `+${countryCode}${digits}`;
  };

  // Detect phone-like input to show country selector
  useEffect(() => {
    const val = (identifier || "").trim();
    const looksLikePhone = /^\+?\d[\d\s-]*$/.test(val) && !val.includes("@");
    setIsPhoneLike(looksLikePhone);
  }, [identifier]);

  useEffect(() => {
    const val = (resetIdentifier || "").trim();
    const looksLikePhone = /^\+?\d[\d\s-]*$/.test(val) && !val.includes("@");
    setIsResetPhoneLike(looksLikePhone);
  }, [resetIdentifier]);

  const validateAndLogin = () => {
    const value = identifier.trim();
    if (!value) {
      setLoginError({ field: "identifier", message: "Email or phone is required" });
      return false;
    }
    const emailOk = isValidEmail(value);
    const phoneE164 = emailOk ? "" : formatToE164(value, selectedDialCode);
    const phoneOk = emailOk ? false : isValidE164Phone(phoneE164);
    if (!emailOk && !phoneOk) {
      setLoginError({ field: "identifier", message: "Enter a valid email or phone" });
      return false;
    }
    if (!password || password.length < 6) {
      setLoginError({ field: "password", message: "Password must be at least 6 characters" });
      return false;
    }
    setLoginError({});
    return true;
  };

  // Update the handleLogin function in LoginPage.tsx
  const handleLogin = async () => {
    if (!validateAndLogin()) return;

    try {
      let result: any;
      const value = identifier.trim();
      const isEmail = isValidEmail(value);
      if (isEmail) {
        result = await dispatch(loginUser({ email: value, password }));
        if ((loginUser as any).fulfilled.match(result)) {
          const redirectTo = (location.state as any)?.redirectTo || "/";
          navigate(redirectTo, { state: (location.state as any)?.nextState, replace: true });
          return;
        }
      } else {
        const e164 = formatToE164(value, selectedDialCode);
        result = await dispatch(loginWithPhoneAndPassword({ phone: e164, password }));
        if ((loginWithPhoneAndPassword as any).fulfilled.match(result)) {
          const redirectTo = (location.state as any)?.redirectTo || "/";
          navigate(redirectTo, { state: (location.state as any)?.nextState, replace: true });
          return;
        }
      }

      // If we reach here, it wasn't fulfilled
      const msg = (result && result.payload) || "Login failed";
      showToast(typeof msg === 'string' ? msg : 'Login failed', { type: 'error' });
    } catch (e: any) {
      showToast(e?.message || "Login failed", { type: "error" });
    }
  };

  const handleReset = async () => {
    const value = resetIdentifier.trim();
    const isEmail = isValidEmail(value);
    const e164Reset = isEmail ? "" : formatToE164(value, selectedResetDialCode);
    const isPhone = isEmail ? false : isValidE164Phone(e164Reset);

    if (!isEmail && !isPhone) {
      showToast("Enter a valid email or phone", { type: "error" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters", { type: "error" });
      return;
    }

    if (isEmail) {
      if (!otp || otp.length !== 6) {
        showToast("Please enter a 6-digit OTP", { type: "error" });
        return;
      }
      await dispatch(resetPasswordWithOtp({ email: value, otp, newPassword }));
      setShowReset(false);
      return;
    }

    try {
      if (!phoneConfirmation) {
        showToast("Please send OTP first", { type: "error" });
        return;
      }
      if (!phoneOtp || phoneOtp.replace(/\D/g, '').length !== 6) {
        showToast("Please enter the 6-digit OTP", { type: "error" });
        return;
      }

      setIsPhoneFlow(true);
      const { PhoneAuthProvider, signInWithCredential } = await import('firebase/auth');
      const { auth } = await import('../../lib/firebaseClient');

      const credential = PhoneAuthProvider.credential(phoneConfirmation.verificationId, phoneOtp.replace(/\D/g, ''));
      const userCred = await signInWithCredential(auth, credential);
      const idToken = await userCred.user.getIdToken();

      const result = await dispatch(resetPasswordWithPhoneToken({ idToken, newPassword }));
      if ((resetPasswordWithPhoneToken as any).fulfilled.match(result)) {
        showToast('Password updated successfully', { type: 'success' });
        setShowReset(false);
      } else {
        const msg = (result as any)?.payload || 'Failed to update password';
        showToast(typeof msg === 'string' ? msg : 'Failed to update password', { type: 'error' });
      }
      setIsPhoneFlow(false);
    } catch (e: any) {
      showToast(e?.message || 'Phone verification failed', { type: 'error' });
      setIsPhoneFlow(false);
    }
  };

  // Send OTP for phone-based reset
  const handleSendPhoneOtp = async () => {
    try {
      if (!resetIdentifier) {
        showToast('Please enter your phone number', { type: 'error' });
        return;
      }
      setIsSendingPhoneOtp(true);
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');
      const { auth } = await import('../../lib/firebaseClient');
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      const phoneE164 = formatToE164(resetIdentifier, selectedResetDialCode);
      const confirmation = await signInWithPhoneNumber(auth, phoneE164, (window as any).recaptchaVerifier);
      setPhoneConfirmation(confirmation);
      showToast('OTP sent to your phone', { type: 'success' });
    } catch (e: any) {
      showToast(e?.message || 'Failed to send OTP', { type: 'error' });
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  // Password visibility handled by TextField

  return (
    <AuthCardLayout
      animationData={registerHero as any}
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
        className=""
      >
          {showReset ? (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleReset();
              }}
            >
              {/* Unified reset: Email or Mobile */}
              <div className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {isResetPhoneLike && (
                    <div className="col-span-1">
                      <label htmlFor="resetDialCode" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        id="resetDialCode"
                        value={selectedResetDialCode}
                        onChange={(e) => setSelectedResetDialCode(e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                      >
                        {DIAL_CODES.map((o) => (
                          <option key={o.code} value={o.code}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className={isResetPhoneLike ? "col-span-4" : "col-span-5"}>
                    <TextField
                      label="Email or Mobile"
                      id="resetIdentifier"
                      value={resetIdentifier}
                      onChange={setResetIdentifier}
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => { const value = resetIdentifier.trim(); const isEmail = isValidEmail(value); const e164 = isEmail ? '' : formatToE164(value, selectedResetDialCode); if (!value || (!isEmail && !isValidE164Phone(e164))) { showToast('Enter a valid email or phone', { type: 'error' }); return; } if (isEmail) { setIsSendingEmailOtp(true); await dispatch(sendPasswordOtp(value)); setIsSendingEmailOtp(false); } else { await handleSendPhoneOtp(); } }}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    disabled={isSendingPhoneOtp || isSendingEmailOtp}
                  >
                    {isSendingEmailOtp || isSendingPhoneOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                  {phoneConfirmation && <span className="text-xs text-green-600">OTP sent</span>}
                </div>
                {/* OTP input shows for both flows */}
                <TextField
                  label="OTP"
                  id="resetOtp"
                  type="text"
                  inputMode="numeric"
                  value={isValidEmail(resetIdentifier) ? otp : phoneOtp}
                  onChange={(v) => (isValidEmail(resetIdentifier) ? setOtp(v.replace(/\D/g, '').slice(0, 6)) : setPhoneOtp(v.replace(/\D/g, '').slice(0, 6)))}
                  maxLength={6}
                  showVisibilityToggle={false}
                />
                {!isValidEmail(resetIdentifier) && <p className="text-xs text-gray-500">We will verify your phone with OTP, then update your password.</p>}
              </div>

              <TextField
                label="New Password"
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                icon={Lock}
                autoComplete="new-password"
              />

              {!isValidEmail(resetIdentifier) && isPhoneFlow && (
                <div className="text-sm text-gray-600">Verifying your phone and updating password...</div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => setShowReset(false)}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Reset Password
                </button>
              </div>

              <div className="mt-3 text-center" />
            </form>
          ) : (
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="grid grid-cols-5 gap-2">
                {isPhoneLike && (
                  <div className="col-span-1">
                    <label htmlFor="loginDialCode" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      id="loginDialCode"
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
                <div className={isPhoneLike ? "col-span-4" : "col-span-5"}>
                  <TextField
                    label="Email or Mobile"
                    id="identifier"
                    value={identifier}
                    onChange={setIdentifier}
                    autoComplete="username"
                    error={loginError.field === 'identifier' ? loginError.message : undefined}
                  />
                </div>
              </div>

              <TextField
                label="Password"
                id="loginPassword"
                type="password"
                value={password}
                onChange={setPassword}
                icon={Lock}
                autoComplete="current-password"
                error={loginError.field === "password" ? loginError.message : undefined}
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    state={location.state}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
                <button
                  type="button"
                  className="block mx-auto text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}
        </motion.div>
        <div id="recaptcha-container" className="hidden" />
    </AuthCardLayout>
  );
};

export default LoginPage;
