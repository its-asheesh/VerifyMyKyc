// src/hooks/useFirebasePhoneAuth.ts
import { useState, useEffect, type RefObject } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';
import { auth } from '../lib/firebaseClient'; // ✅ Import from existing file

export const useFirebasePhoneAuth = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Handle null ref safely
    if (!containerRef.current) {
      console.warn('Recaptcha container not ready');
      return;
    }

    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }

    try {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        containerRef.current, // ✅ Now guaranteed non-null here
        {
          size: 'invisible',
          callback: () => console.log('✅ reCAPTCHA solved'),
          'expired-callback': () => console.log('⚠️ reCAPTCHA expired'),
        }
      );
    } catch (err: any) {
      console.error('❌ RecaptchaVerifier error:', err);
      setError('Failed to load reCAPTCHA. Please refresh.');
    }

    return () => {
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        delete (window as any).recaptchaVerifier;
      }
    };
  }, [containerRef]);


  const sendOtp = async (phoneNumber: string) => {
    if (!(window as any).recaptchaVerifier) {
      throw new Error('reCAPTCHA not ready. Please wait or refresh.');
    }

    setIsSendingOtp(true);
    setError(null);
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, (window as any).recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error('❌ Send OTP error:', err);
      const message = err.message || 'Failed to send OTP. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async (code: string) => {
    if (!confirmationResult) {
      throw new Error('No OTP request found. Please request a new code.');
    }

    setIsVerifyingOtp(true);
    setError(null);
    try {
      const userCredential = await confirmationResult.confirm(code);
      const idToken = await userCredential.user.getIdToken();
      return idToken;
    } catch (err: any) {
      console.error('❌ Verify OTP error:', err);
      const message = err.message || 'Invalid or expired OTP.';
      setError(message);
      throw err;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return {
    sendOtp,
    verifyOtp,
    isSendingOtp,
    isVerifyingOtp,
    error,
  };
};