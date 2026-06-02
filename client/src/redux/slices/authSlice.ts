import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getUserLocationData,
  getFallbackLocationData,
} from "../../utils/locationUtils";
import { validateToken } from "../../utils/tokenUtils";
import { analyticsSetUserId, analyticsLogEvent } from "../../lib/firebaseClient";
import { getTokenCookie, getUserCookie, areCookiesSupported } from "../../utils/cookieUtils";
import type { RootState } from "../../redux/store";

// Types
export interface User {
  id: string;
  email?: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  company?: string;
  phone?: string;
  lastLogin?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  location?: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    ipAddress?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingEmail?: string;
  pendingPhone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Helper to safely extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return "An unexpected error occurred";
};

// Helper function to initialize auth state with token validation
const initializeAuthState = (): AuthState => {
  // Try to get token from cookies first, then localStorage
  let token = null;
  let user = null;

  // Check cookies first (more reliable)
  if (areCookiesSupported()) {
    token = getTokenCookie();
    user = getUserCookie();
  }

  // Fallback to localStorage if no cookie token
  if (!token) {
    token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {
        user = null;
      }
    }
  }

  if (!token) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingPhone: undefined,
    };
  }

  const { isValid } = validateToken(token);

  if (!isValid) {
    // Clean up invalid tokens from both storage methods
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (areCookiesSupported()) {
      import("../../utils/cookieUtils").then(({ removeTokenCookie, removeUserCookie }) => {
        removeTokenCookie();
        removeUserCookie();
      });
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingPhone: undefined,
    };
  }

  return {
    user: user,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
    pendingPhone: undefined,
  };
};

const initialState: AuthState = initializeAuthState();
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const apiCall = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; message?: string }> => {
  const token = localStorage.getItem("token");

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};

// PHONE AUTH THUNKS - Simplified: Component handles Firebase, thunk only handles backend
export const sendPhoneOtp = createAsyncThunk(
  "auth/sendPhoneOtp",
  async (phone: string, { rejectWithValue }) => {
    // This thunk is kept for consistency, but in reality,
    // OTP sending should be handled entirely in the component
    // We'll just store the pending phone number
    try {
      const formattedPhone = phone.startsWith("+")
        ? phone
        : `+${phone.replace(/\D/g, "")}`;
      localStorage.setItem("pendingPhone", formattedPhone);
      return { phone: formattedPhone };
    } catch {
      return rejectWithValue("Failed to prepare phone verification");
    }
  }
);

export const verifyPhoneOtp = createAsyncThunk<AuthResponse, {
  idToken: string;
  name?: string;
  company?: string;
  password?: string;
}, { rejectValue: string }>(
  "auth/verifyPhoneOtp",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiCall<{ user: User; token: string }>("/auth/phone/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // ✅ Save token
      localStorage.setItem("token", response.data.token);

      // ✅ Return full user data (must match your User interface)
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Registration failed");
    }
  }
);

export const loginWithPhone = createAsyncThunk<AuthResponse, string, { rejectValue: string }>(
  "auth/loginWithPhone",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await apiCall<{ user: User; token: string }>("/auth/phone/login", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });

      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Phone login failed");
    }
  }
);

export const loginWithPhoneAndPassword = createAsyncThunk<AuthResponse, { phone: string; password: string }, { rejectValue: string }>(
  "auth/loginWithPhoneAndPassword",
  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      // ... existing code ...

      const response = await apiCall<{ user: User; token: string }>("/auth/login/phone-password", {
        method: "POST",
        body: JSON.stringify({
          ...credentials,
          location: Location,
        }),
      });

      localStorage.setItem("token", response.data.token);
      return response.data; // returns full response
    } catch (error: unknown) {
      console.error('Login error:', error);
      return rejectWithValue(getErrorMessage(error) || "Login failed");
    }
  }
);

// Existing async thunks (email/password auth)
export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      let locationData;
      try {
        locationData = await getUserLocationData();
      } catch (error) {
        console.warn("Could not get location data, using fallback:", error);
        locationData = getFallbackLocationData();
      }

      const response = await apiCall<{ user: User; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          ...credentials,
          location: locationData,
        }),
      });

      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk<{ user: User | null; message: string }, RegisterData, { rejectValue: string }>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      let locationData;
      try {
        locationData = await getUserLocationData();
      } catch (error) {
        console.warn("Could not get location data, using fallback:", error);
        locationData = getFallbackLocationData();
      }

      const response = await apiCall<{ user: User; message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...userData,
          location: locationData,
        }),
      });

      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Registration failed");
    }
  }
);

export const sendEmailOtp = createAsyncThunk<boolean, string, { rejectValue: string }>(
  "auth/sendEmailOtp",
  async (email, { rejectWithValue }) => {
    try {
      await apiCall("/auth/send-email-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to send OTP");
    }
  }
);

export const verifyEmailOtp = createAsyncThunk<AuthResponse, { email: string; otp: string }, { rejectValue: string }>(
  "auth/verifyEmailOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall<{ user: User; token: string }>("/auth/verify-email-otp", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Invalid OTP");
    }
  }
);

export const sendPasswordOtp = createAsyncThunk<boolean, string, { rejectValue: string }>(
  "auth/sendPasswordOtp",
  async (email, { rejectWithValue }) => {
    try {
      await apiCall("/auth/password/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to send password OTP");
    }
  }
);

export const resetPasswordWithOtp = createAsyncThunk<AuthResponse, { email: string; otp: string; newPassword: string }, { rejectValue: string }>(
  "auth/resetPasswordWithOtp",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiCall<{ user: User; token: string }>("/auth/password/reset", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to reset password");
    }
  }
);

// Reset password using Firebase Phone ID token (phone-registered users)
export const resetPasswordWithPhoneToken = createAsyncThunk<AuthResponse, { idToken: string; newPassword: string }, { rejectValue: string }>(
  "auth/resetPasswordWithPhoneToken",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiCall<{ user: User; token: string }>("/auth/password/reset-phone", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to update password");
    }
  }
);

export const refreshToken = createAsyncThunk<{ token: string }, void, { rejectValue: string }>(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const currentToken = state.auth.token;

      if (!currentToken) {
        return rejectWithValue("No token to refresh");
      }

      const response = await apiCall<{ token: string }>("/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: currentToken }),
      });

      const newToken = response.data.token;

      // Update both localStorage and cookies
      localStorage.setItem("token", newToken);
      if (areCookiesSupported()) {
        import("../../utils/cookieUtils").then(({ setTokenCookie }) => {
          setTokenCookie(newToken, true);
        });
      }

      return { token: newToken };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to refresh token");
    }
  }
);

export const fetchUserProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall<{ user: User }>("/auth/profile");
      return response.data.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to fetch profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiCall<{ user: User }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      return response.data.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to update profile");
    }
  }
);

export const changePassword = createAsyncThunk<{ message: string }, { currentPassword: string; newPassword: string }, { rejectValue: string }>(
  "auth/changePassword",
  async (
    passwordData,
    { rejectWithValue }
  ) => {
    try {
      await apiCall("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(passwordData),
      });
      return { message: "Password changed successfully" };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error) || "Failed to change password");
    }
  }
);

export const validateTokenAndLogout = createAsyncThunk<{ isValid: boolean }, void, { state: RootState }>(
  "auth/validateToken",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const { token } = state.auth;

    if (!token) {
      return { isValid: false };
    }

    const { isValid } = validateToken(token);

    if (!isValid) {
      dispatch(logout());
      return { isValid: false };
    }

    return { isValid: true };
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingEmail = undefined;
      state.pendingPhone = undefined;

      // Clean localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("phoneVerificationId");
      localStorage.removeItem("pendingPhone");

      // Clean cookies if supported
      if (areCookiesSupported()) {
        import("../../utils/cookieUtils").then(({ removeTokenCookie, removeUserCookie }) => {
          removeTokenCookie();
          removeUserCookie();
        });
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        // loginUser thunk returns AuthResponse now
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.pendingEmail = undefined;

        // Store in localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));

        // Store in cookies if supported (more reliable)
        if (areCookiesSupported()) {
          const payload = action.payload;
          import("../../utils/cookieUtils").then(({ setTokenCookie, setUserCookie }) => {
            setTokenCookie(payload.token, true); // rememberMe = true for regular login
            setUserCookie(payload.user, true);
          });
        }

        // Fire-and-forget analytics
        try {
          const uid = action.payload.user.id;
          if (uid) void analyticsSetUserId(uid);
          void analyticsLogEvent("login", { method: "email" });
        } catch {
          // ignore
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingEmail = action.payload.user?.email || undefined;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })
      // Send Email OTP
      .addCase(sendEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendEmailOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send OTP";
      })
      // Verify Email OTP
      .addCase(verifyEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.pendingEmail = undefined;
        // Fire-and-forget analytics
        try {
          const uid = action.payload.user.id;
          if (uid) void analyticsSetUserId(uid);
          void analyticsLogEvent("sign_up", { method: "email" });
        } catch {
          // ignore
        }
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Invalid OTP";
      })
      // Password reset send OTP
      .addCase(sendPasswordOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPasswordOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendPasswordOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send password OTP";
      })
      // Reset password with OTP
      .addCase(resetPasswordWithOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordWithOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(resetPasswordWithOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to reset password";
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch profile";
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to refresh token";
        // If refresh fails, logout the user
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (areCookiesSupported()) {
          import("../../utils/cookieUtils").then(({ removeTokenCookie, removeUserCookie }) => {
            removeTokenCookie();
            removeUserCookie();
          });
        }
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update profile";
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to change password";
      })
      // Validate Token
      .addCase(validateTokenAndLogout.fulfilled, (state, action) => {
        if (!action.payload.isValid) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
          localStorage.removeItem("token");
        }
      })
      // Phone Auth Reducers
      .addCase(sendPhoneOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPhoneOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingPhone = action.payload.phone;
        state.error = null;
      })
      .addCase(sendPhoneOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.pendingPhone = undefined;
      })
      // Verify Phone OTP - Simplified payload
      .addCase(verifyPhoneOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.pendingPhone = undefined;
        state.error = null;
        // Fire-and-forget analytics
        try {
          const uid = action.payload.user.id;
          if (uid) void analyticsSetUserId(uid);
          void analyticsLogEvent("sign_up", { method: "phone" });
        } catch {
          // ignore
        }
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Verification failed";
        state.pendingPhone = undefined;
      })
      // Phone Login
      .addCase(loginWithPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        // Fire-and-forget analytics
        try {
          const uid = action.payload.user.id;
          if (uid) void analyticsSetUserId(uid);
          void analyticsLogEvent("login", { method: "phone" });
        } catch {
          // ignore
        }
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })

      // Phone + Password Login
      .addCase(loginWithPhoneAndPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPhoneAndPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.pendingPhone = undefined;

        // Store in localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));

        // Store in cookies if supported (more reliable)
        if (areCookiesSupported()) {
          const payload = action.payload;
          import("../../utils/cookieUtils").then(({ setTokenCookie, setUserCookie }) => {
            setTokenCookie(payload.token, true);
            setUserCookie(payload.user, true);
          });
        }
      })
      .addCase(loginWithPhoneAndPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;

export default authSlice.reducer;
