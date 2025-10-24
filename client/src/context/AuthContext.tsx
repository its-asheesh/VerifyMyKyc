// src/context/AuthContext.tsx
"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getTokenCookie, getUserCookie, setTokenCookie, setUserCookie, removeTokenCookie, removeUserCookie, areCookiesSupported } from "../utils/cookieUtils";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithOtp: (email: string, otp: string) => Promise<void>;
  loginWithMobile: (idToken: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  applyAuth: (payload: { user: User; token: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

interface AuthProviderProps { children: ReactNode }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get token from cookies first, then localStorage
    let storedToken = null;
    let storedUser = null;

    if (areCookiesSupported()) {
      storedToken = getTokenCookie();
      storedUser = getUserCookie();
    }

    // Fallback to localStorage if no cookie data
    if (!storedToken) {
      storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    }
    if (!storedUser) {
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userData) {
        try {
          storedUser = JSON.parse(userData);
        } catch {
          storedUser = null;
        }
      }
    }

    if (storedToken && storedUser) {
      try {
        setUser(storedUser);
        setToken(storedToken);
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    const userData: User = {
      _id: data.data.user.id,
      name: data.data.user.name,
      email: data.data.user.email,
      role: data.data.user.role,
    };
    setUser(userData);
    setToken(data.data.token);
    if (rememberMe) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      
      // Also store in cookies for better persistence
      if (areCookiesSupported()) {
        setTokenCookie(data.data.token, true);
        setUserCookie(userData, true);
      }
    } else {
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Store in cookies for session persistence
      if (areCookiesSupported()) {
        setTokenCookie(data.data.token, false);
        setUserCookie(userData, false);
      }
    }
  };

  const loginWithFirebase = async (idToken: string) => {
    const res = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Authentication failed");
    }
    const data = await res.json();
    const userData: User = {
      _id: data.data.user.id,
      name: data.data.user.name,
      email: data.data.user.email,
      role: data.data.user.role,
    };
    setUser(userData);
    setToken(data.data.token);
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const loginWithGoogle = (idToken: string) => loginWithFirebase(idToken);
  const loginWithMobile = (idToken: string) => loginWithFirebase(idToken);

  const loginWithOtp = async (email: string, otp: string) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) throw new Error("OTP verification failed");
    const data = await res.json();
    const userData: User = {
      _id: data.data.user.id,
      name: data.data.user.name,
      email: data.data.user.email,
      role: data.data.user.role,
    };
    setUser(userData);
    setToken(data.data.token);
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    
    // Also clean cookies
    if (areCookiesSupported()) {
      removeTokenCookie();
      removeUserCookie();
    }
  };

  const applyAuth = ({ user, token }: { user: User; token: string }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    loginWithGoogle,
    loginWithOtp,
    loginWithMobile,
    logout,
    setUser,
    setToken,
    applyAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



