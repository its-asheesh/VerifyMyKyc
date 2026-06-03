import { useState, useCallback } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { useToast } from '../components/common/ToastProvider';
import { isValidEmail } from '../utils/validators';
import { registerUser, sendEmailOtp, verifyEmailOtp, verifyPhoneOtp } from '../redux/slices/authSlice';
import { usePhoneAuth } from './usePhoneAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface UseAuthFlowProps {
    onStepChange: (step: 1 | 2) => void;
}

export const useAuthFlow = ({ onStepChange }: UseAuthFlowProps) => {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    // Delegate phone auth mechanism
    const {
        recaptchaRef,
        sendOtp: sendPhoneOtp,
        verifyOtp: verifyFirebasePhoneOtp,
        isSendingOtp: isSendingPhoneOtp
    } = usePhoneAuth("recaptcha-container");

    const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
    const [pendingEmail, setPendingEmail] = useState<string | undefined>();
    const [pendingPhoneIdent, setPendingPhoneIdent] = useState<string | undefined>();
    const [pendingDialCode, setPendingDialCode] = useState<string>("91");

    const initiateRegister = useCallback(async (data: {
        name: string;
        identifier: string;
        password: string;
        company?: string;
        dialCode: string;
    }) => {
        const { identifier, dialCode, name, password, company } = data;
        const trimmedIdentifier = identifier.trim();
        const isEmail = isValidEmail(trimmedIdentifier);

        try {
            if (isEmail) {
                setIsSendingEmailOtp(true);
                const result = await dispatch(
                    registerUser({ name, email: trimmedIdentifier, password, company })
                );
                if (registerUser.fulfilled.match(result)) {
                    setPendingEmail(trimmedIdentifier);
                    onStepChange(2);
                } else {
                    const msg = (result.payload as string) || "Registration failed";
                    showToast(msg, { type: "error" });
                }
                setIsSendingEmailOtp(false);
            } else {
                // Phone flow
                setIsSendingEmailOtp(true);
                try {
                    let formattedPhone = trimmedIdentifier;
                    if (!formattedPhone.startsWith('+')) {
                        const cleanDialCode = dialCode.replace(/\D/g, '');
                        const cleanPhone = formattedPhone.replace(/\D/g, '');
                        formattedPhone = `+${cleanDialCode}${cleanPhone}`;
                    }

                    const checkResponse = await fetch(`${API_BASE_URL}/auth/check-exists`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: formattedPhone })
                    });
                    const checkData = await checkResponse.json();

                    if (checkData.exists) {
                        showToast("User with this phone number already exists. Please log in instead.", { type: "error" });
                        setIsSendingEmailOtp(false);
                        return;
                    }
                } catch (err) {
                    console.error("Check exists failed, proceeding with OTP", err);
                }

                setIsSendingEmailOtp(false);

                const success = await sendPhoneOtp(trimmedIdentifier, dialCode);
                if (success) {
                    setPendingPhoneIdent(trimmedIdentifier);
                    setPendingDialCode(dialCode);
                    onStepChange(2);
                }
            }
        } catch (err: any) {
            showToast("Failed to initiate registration", { type: "error" });
            setIsSendingEmailOtp(false);
        }
    }, [dispatch, sendPhoneOtp, onStepChange, showToast]);

    const verifyOtp = useCallback(async (otp: string, extraData: { name: string; company?: string; password?: string }) => {
        if (otp.length !== 6) {
            showToast("Please enter a 6-digit OTP", { type: "error" });
            return;
        }

        if (pendingEmail) {
            await dispatch(verifyEmailOtp({ email: pendingEmail, otp }));
        } else if (pendingPhoneIdent) {
            const idToken = await verifyFirebasePhoneOtp(otp);
            if (idToken) {
                await dispatch(verifyPhoneOtp({
                    idToken,
                    name: extraData.name,
                    company: extraData.company || "",
                    password: extraData.password || "",
                }));
            }
        }
    }, [pendingEmail, pendingPhoneIdent, dispatch, verifyFirebasePhoneOtp, showToast]);

    const resendOtp = useCallback(async () => {
        if (pendingEmail) {
            await dispatch(sendEmailOtp(pendingEmail));
        } else if (pendingPhoneIdent) {
            await sendPhoneOtp(pendingPhoneIdent, pendingDialCode);
        }
    }, [pendingEmail, pendingPhoneIdent, pendingDialCode, dispatch, sendPhoneOtp]);

    return {
        recaptchaRef,
        isSendingOtp: isSendingPhoneOtp || isSendingEmailOtp,
        initiateRegister,
        verifyOtp,
        resendOtp,
        pendingEmail,
        pendingPhone: pendingPhoneIdent // maintaining API compatibility
    };
};
