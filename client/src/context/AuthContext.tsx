// src/context/AuthContext.tsx
"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithOtp: (email: string, otp: string) => Promise<void>;
  loginWithMobile: (idToken: string) => Promise<void>; // ✅ Added
  logout: () => void;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load from storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        console.log("✅ User restored:", parsedUser.email);
      } catch (e) {
        console.error("Failed to parse user data");
        logout();
      }
    }
    setLoading(false);
  }, []);

  // 🔐 Traditional Login
  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    const userData = {
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
    } else {
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  // 🔵 Google or Mobile Auth (via Firebase ID Token)
  const loginWithFirebase = async (idToken: string) => {
    const response = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Authentication failed");
    }

    const data = await response.json();
    const userData = {
      _id: data.data.user.id,
      name: data.data.user.name,
      email: data.data.user.email,
      role: data.data.user.role,
    };

    setUser(userData);
    setToken(data.data.token);

    // Persist in localStorage (user expects "stay signed in")
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  // ✅ Reuse for both Google and Mobile
  const loginWithGoogle = (idToken: string) => loginWithFirebase(idToken);
  const loginWithMobile = (idToken: string) => loginWithFirebase(idToken);

  // 📧 Email OTP Login
  const loginWithOtp = async (email: string, otp: string) => {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "OTP verification failed");
    }

    const data = await response.json();
    const userData = {
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

  // 🚪 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    login,
    loginWithGoogle,
    loginWithOtp,
    loginWithMobile, // ✅ Exported
    logout,
    loading,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};