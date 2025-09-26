// src/pages/auth/RegisterPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '../../components/common/ToastProvider';

// ✅ Import your MUI/Auth components
import { AuthCardLayout } from './AuthCardLayout';
import { AuthErrorAlert } from './AuthErrorAlert';
import { GoogleButton } from './GoogleButton';
import { AuthMethodDivider } from './AuthMethodDivider';
import { AuthRedirectLink } from './AuthRedirectLink';
import { OtpForm } from './OtpForm';
import { MobileOtpForm } from './MobileOtpForm';

// ✅ Firebase & OTP hooks
import { useGoogleAuthHandler } from '../../hooks/useGoogleAuthHandler';
import { useOtpFlow } from '../../hooks/useOtpFlow';
import { useFirebasePhoneAuth } from '../../hooks/useFirebasePhoneAuth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  // 🔁 Form states
  const [step, setStep] = useState<'form' | 'otp' | 'mobile'>('form');
  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [passwordForOtp, setPasswordForOtp] = useState('');
  const [nameForOtp, setNameForOtp] = useState('');
  const [companyForOtp, setCompanyForOtp] = useState('');
  const [phoneForOtp, setPhoneForOtp] = useState('');

  // 🔐 Traditional form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const isMounted = useRef(true);
  // ✅ Create reCAPTCHA container ref
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // 🔁 Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as any)?.redirectTo;
      if (redirectTo) {
        navigate(redirectTo, { state: (location.state as any)?.nextState });
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, location.state]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false;
      dispatch(clearError());
    };
  }, [dispatch]);

  // ✅ Google Auth
  const { handleGoogleAuth, isPending: isGooglePending } = useGoogleAuthHandler();

  // ✅ Email OTP
  const {
    sendOtp,
    isSendingOtp,
    sendOtpError,
    verifyOtp,
    isVerifyingOtp,
    verifyOtpError,
  } = useOtpFlow();

  // ✅ Mobile OTP - PASS THE REF!
  const {
    sendOtp: sendMobileOtp,
    verifyOtp: verifyMobileOtp,
    isSendingOtp: isSendingMobileOtp,
    isVerifyingOtp: isVerifyingMobileOtp,
    error: mobileOtpError,
  } = useFirebasePhoneAuth(recaptchaContainerRef); // 👈 FIXED: pass ref

  // 🔍 Validate traditional form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 📤 Submit traditional form → send OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await sendOtp(formData.email);
        setEmailForOtp(formData.email);
        setPasswordForOtp(formData.password);
        setNameForOtp(formData.name);
        setCompanyForOtp(formData.company);
        setPhoneForOtp(formData.phone);
        setStep('otp');
      } catch (err) {
        console.error('Failed to send OTP:', err);
      }
    }
  };

  // ✅ Verify Email OTP → complete registration
  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({
        email: emailForOtp,
        otp,
        password: passwordForOtp,
      });

      await dispatch(
        registerUser({
          name: nameForOtp,
          email: emailForOtp,
          password: passwordForOtp,
          company: companyForOtp,
          phone: phoneForOtp,
        })
      );
    } catch (err: any) {
      console.error('OTP verification failed:', err);
    }
  };

  // 🔄 Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // 🎯 Combine errors - FIXED: mobileOtpError is string, not object
  const combinedError =
    error ||
    sendOtpError?.message ||
    verifyOtpError?.message ||
    mobileOtpError || // ✅ No .message - it's already a string
    '';

  return (
    <AuthCardLayout
      title={step === 'form' ? 'Create Account' : step === 'otp' ? 'Verify Email' : 'Verify Mobile'}
      subtitle={
        step === 'form'
          ? 'Join VerifyMyKyc today'
          : step === 'otp'
          ? 'Enter the code sent to your email'
          : 'Enter the code sent to your phone'
      }
      icon={<User />}
    >
      {/* Back button for OTP/mobile steps */}
      {step !== 'form' && (
        <button
          onClick={() => setStep('form')}
          className="absolute top-4 left-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <AuthErrorAlert message={combinedError} />

      {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
            </div>
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
            </div>
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Company"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+1 234 567 890"
              />
            </div>
            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isSendingOtp}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSendingOtp ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </span>
            ) : (
              'Continue with Email'
            )}
          </button>

          <AuthMethodDivider text="Or sign up with" />

          {/* Google */}
          <GoogleButton
            onClick={handleGoogleAuth}
            isPending={isGooglePending}
            label="Sign up with Google"
          />

          {/* Mobile OTP */}
          <button
            type="button"
            onClick={() => setStep('mobile')}
            className="w-full py-2.5 text-blue-600 font-medium hover:text-blue-800 transition"
          >
            Sign up with Mobile OTP
          </button>

          <AuthRedirectLink
            text="Already have an account?"
            href="/login"
            linkText="Sign in"
          />
        </form>
      )}

      {step === 'otp' && (
        <OtpForm
          otp={otp}
          setOtp={setOtp}
          onVerify={handleVerifyOtp}
          isVerifying={isVerifyingOtp}
          onBack={() => setStep('form')}
          error={!!verifyOtpError}
          onResend={() => sendOtp(emailForOtp)}
          expiryTime={600}
          subtitle="We sent a code to your email"
        />
      )}

      {step === 'mobile' && (
        <MobileOtpForm
          standalone={false}
          onBack={() => setStep('form')}
          onSendOtp={sendMobileOtp}
          // ✅ FIXED: Wrap to match expected signature (returns void)
          onVerifyOtp={async (phone, otp) => {
            try {
              const idToken = await verifyMobileOtp(otp);
              // Complete login with Firebase ID token
              const response = await fetch('/api/auth/firebase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
              }
              
              const data = await response.json();
              // Optional: Update Redux store or context here
              // For now, just redirect
              navigate('/');
            } catch (err) {
              console.error('Mobile OTP login failed:', err);
              throw err; // MobileOtpForm will handle display
            }
          }}
          isSendingOtp={isSendingMobileOtp}
          isVerifyingOtp={isVerifyingMobileOtp}
          sendOtpError={mobileOtpError}
          verifyOtpError={mobileOtpError}
        />
      )}

      {/* 🔒 reCAPTCHA container - MUST be in DOM */}
      <div ref={recaptchaContainerRef} style={{ display: 'none' }} />
    </AuthCardLayout>
  );
};

export default RegisterPage;