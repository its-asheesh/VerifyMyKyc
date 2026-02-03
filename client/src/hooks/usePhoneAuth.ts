import { useState, useCallback } from 'react';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import { useRecaptcha } from './useRecaptcha';
import { useToast } from '../components/common/ToastProvider';
import { formatToE164 } from '../utils/authUtils';

interface UsePhoneAuthReturn {
    isSendingOtp: boolean;
    isVerifyingOtp: boolean;
    confirmationResult: ConfirmationResult | null;
    sendOtp: (phoneNumber: string, dialCode?: string) => Promise<boolean>;
    verifyOtp: (otp: string) => Promise<string | null>; // Returns ID Token on success
    recaptchaRef: React.RefObject<HTMLDivElement | null>;
    resetState: () => void;
}

export const usePhoneAuth = (recaptchaContainerId = "recaptcha-container"): UsePhoneAuthReturn => {
    const { recaptchaRef, initRecaptcha } = useRecaptcha(recaptchaContainerId);
    const { showToast } = useToast();

    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    const sendOtp = useCallback(async (phoneNumber: string, dialCode: string = "91") => {
        setIsSendingOtp(true);
        try {
            const appVerifier = initRecaptcha();
            if (!appVerifier) {
                showToast("Recaptcha initialization failed", { type: "error" });
                return false;
            }

            const e164Phone = formatToE164(phoneNumber, dialCode);
            const confirmation = await signInWithPhoneNumber(auth, e164Phone, appVerifier);
            setConfirmationResult(confirmation);
            showToast("OTP sent successfully", { type: "success" });
            return true;
        } catch (error: any) {
            let msg = "Failed to send OTP";
            if (error?.code === "auth/invalid-phone-number") msg = "Invalid phone number";
            else if (error?.code === "auth/too-many-requests") msg = "Too many attempts. Try again later.";

            showToast(msg, { type: "error" });
            return false;
        } finally {
            setIsSendingOtp(false);
        }
    }, [initRecaptcha, showToast]);

    const verifyOtp = useCallback(async (otp: string): Promise<string | null> => {
        if (!confirmationResult) {
            showToast("Please request OTP first", { type: "error" });
            return null;
        }

        setIsVerifyingOtp(true);
        try {
            const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
            const userCredential = await signInWithCredential(auth, credential);
            const idToken = await userCredential.user.getIdToken();
            return idToken;
        } catch (error: any) {
            let msg = "Invalid OTP";
            if (error?.code === "auth/invalid-verification-code") msg = "Incorrect OTP";
            else if (error?.code === "auth/code-expired") msg = "OTP has expired";

            showToast(msg, { type: "error" });
            return null;
        } finally {
            setIsVerifyingOtp(false);
        }
    }, [confirmationResult, showToast]);

    const resetState = useCallback(() => {
        setConfirmationResult(null);
        setIsSendingOtp(false);
        setIsVerifyingOtp(false);
    }, []);

    return {
        isSendingOtp,
        isVerifyingOtp,
        confirmationResult,
        sendOtp,
        verifyOtp,
        recaptchaRef,
        resetState
    };
};
