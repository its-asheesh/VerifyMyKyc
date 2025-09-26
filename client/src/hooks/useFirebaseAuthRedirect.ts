// src/hooks/useFirebaseAuthRedirect.ts
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ We don't need navigate here anymore
import { auth, getRedirectResult } from "../lib/firebaseClient";

const isReturningFromRedirect = () => {
  if (typeof window === "undefined") return false;
  const { search } = window.location;
  return search.includes("state=") || search.includes("code=");
};

export const useFirebaseAuthRedirect = (
  onGoogleSuccess?: (user: any) => void,
  onError?: (error: any) => void
) => {
  const { loginWithGoogle } = useAuth();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;

    const handleRedirect = async () => {
      console.log("🔍 [useFirebaseAuthRedirect] Hook triggered");

      if (!isReturningFromRedirect()) {
        console.log("🔍 Not returning from OAuth — skipping");
        return;
      }

      hasHandled.current = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const result = await getRedirectResult(auth);

        console.log("🔍 Redirect result received:", result);

        if (result?.user) {
          console.log("✅ User authenticated via Google:", result.user.email);

          const idToken = await result.user.getIdToken();
          console.log("🔑 ID Token obtained (first 30 chars):", idToken.substring(0, 30) + "...");

          if (onGoogleSuccess) {
            console.log("⚙️ Custom success handler provided — invoking it...");
            await onGoogleSuccess(result.user);
          } else {
            console.log("⚙️ No custom handler — calling loginWithGoogle...");
            await loginWithGoogle(idToken);
            console.log("✅ loginWithGoogle completed — USER CONTEXT UPDATED");
            // ❌ DO NOT NAVIGATE HERE — let your app’s routing logic handle it
          }
        } else {
          console.warn("⚠️ Redirect result is null.");
          onError?.(new Error("Google sign-in was interrupted"));
        }
      } catch (error) {
        console.error("❌ [useFirebaseAuthRedirect] Fatal error:", error);
        onError?.(error);
      }
    };

    handleRedirect();
  }, [loginWithGoogle, onGoogleSuccess, onError]);
};