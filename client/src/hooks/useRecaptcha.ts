import { useEffect, useRef } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
    }
}

export const useRecaptcha = (containerId: string) => {
    const recaptchaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Clear any existing verifier on mount/unmount to avoid duplicates
        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = undefined;
            }
        };
    }, []);

    const initRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                size: "invisible",
            });
            // Pre-render if possible
            window.recaptchaVerifier.render?.().catch((err) => {
                console.warn("Recaptcha pre-render failed", err);
            });
        }
        return window.recaptchaVerifier;
    };

    return { recaptchaRef, initRecaptcha };
};
