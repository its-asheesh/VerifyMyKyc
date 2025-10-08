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
} from "../../redux/slices/authSlice";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Smartphone,
  Phone,
} from "lucide-react";
import { useToast } from "../../components/common/ToastProvider";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();

  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showReset, setShowReset] = useState(false);

  // Login form
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<{
    field?: string;
    message?: string;
  }>({});

  // Reset form
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Redirect if authenticated

  useEffect(() => {
    if (isAuthenticated && user) {
      // ✅ Add user check
      const redirectTo = (location.state as any)?.redirectTo || "/";
      navigate(redirectTo, { state: (location.state as any)?.nextState });
    }
    console.log('Auth state:', { isAuthenticated, user });
  }, [isAuthenticated, user, navigate, location.state]); // ✅ Add user to dependencies


  useEffect(() => {
    const message = (location.state as any)?.message;
    if (message) showToast(message, { type: "info" });
  }, [location.state, showToast]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateAndLogin = () => {
    let field = authMethod === "email" ? "email" : "phone";
    let value = emailOrPhone.trim();

    if (!value) {
      setLoginError({
        field,
        message: `${field === "email" ? "Email" : "Phone"} is required`,
      });
      return false;
    }

    if (authMethod === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setLoginError({ field: "email", message: "Invalid email" });
        return false;
      }
    } else {
      // Basic phone validation
      const digits = value.replace(/\D/g, "");
      if (digits.length < 10) {
        setLoginError({ field: "phone", message: "Invalid phone number" });
        return false;
      }
    }

    if (!password || password.length < 6) {
      setLoginError({
        field: "password",
        message: "Password must be at least 6 characters",
      });
      return false;
    }

    setLoginError({});
    return true;
  };

  // Update the handleLogin function in LoginPage.tsx
  const handleLogin = async () => {
    if (!validateAndLogin()) return;

    if (authMethod === "email") {
      // Email login - existing functionality
      await dispatch(loginUser({ email: emailOrPhone, password }));
    } else {
      // Phone + Password login - new functionality
      await dispatch(
        loginWithPhoneAndPassword({ phone: emailOrPhone, password })
      );
    }
  };

  const handleReset = async () => {
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      showToast("Please enter a valid email", { type: "error" });
      return;
    }
    if (!otp || otp.length !== 6) {
      showToast("Please enter a 6-digit OTP", { type: "error" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast("Password must be at least 6 characters", { type: "error" });
      return;
    }
    await dispatch(
      resetPasswordWithOtp({ email: resetEmail, otp, newPassword })
    );
    setShowReset(false);
  };

  const [showPassword, setShowPassword] = useState(false);

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
            Welcome back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>

          {/* Auth Method Toggle */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => {
                setAuthMethod("email");
                setLoginError({});
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                authMethod === "email"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <Mail className="inline mr-1 h-4 w-4" /> Email
            </button>
            <button
              onClick={() => {
                setAuthMethod("phone");
                setLoginError({});
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                authMethod === "phone"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <Smartphone className="inline mr-1 h-4 w-4" /> Phone
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
          {showReset ? (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleReset();
              }}
            >
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => dispatch(sendPasswordOtp(resetEmail))}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Send OTP
                </button>
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit OTP"
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (6+ chars)"
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              />

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
            </form>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {authMethod === "email" ? (
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
                      type="email"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                        loginError.field === "email"
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {loginError.field === "email" && (
                    <p className="mt-1 text-sm text-red-600">
                      {loginError.message}
                    </p>
                  )}
                </div>
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
                      value={emailOrPhone}
                      onChange={(e) =>
                        setEmailOrPhone(e.target.value.replace(/[^\d+]/g, ""))
                      }
                      className={`appearance-none block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                        loginError.field === "phone"
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g. +919876543210"
                    />
                  </div>
                  {loginError.field === "phone" && (
                    <p className="mt-1 text-sm text-red-600">
                      {loginError.message}
                    </p>
                  )}
                </div>
              )}

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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                      loginError.field === "password"
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
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
                {loginError.field === "password" && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginError.message}
                  </p>
                )}
              </div>

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

              <div className="text-center">
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
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
