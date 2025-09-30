// src/hooks/useGoogleAuth.ts
import { useMutation } from "@tanstack/react-query";
import { auth, googleProvider, signInWithPopup } from "../lib/firebaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      if (typeof window === "undefined") throw new Error("Google Sign-In is only available in browser");
      if (!auth?.app) throw new Error("Firebase not initialized");
      if (!googleProvider) throw new Error("Google provider not configured");

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);
      await loginWithGoogle(idToken);
      navigate("/");
      return { success: true };
    },
  });
};



