import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getUserLocationData, getFallbackLocationData } from "../../utils/locationUtils";
import { validateToken } from "../../utils/tokenUtils";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
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

// Helper function to initialize auth state with token validation
const initializeAuthState = (): AuthState => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingPhone: undefined
    };
  }

  const { isValid, payload } = validateToken(token);
  
  if (!isValid) {
    localStorage.removeItem('token');
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingPhone: undefined
    };
  }

  return {
    user: null,
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
    pendingPhone: undefined
  };
};

const initialState: AuthState = initializeAuthState();
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// PHONE AUTH THUNKS - Simplified: Component handles Firebase, thunk only handles backend
export const sendPhoneOtp = createAsyncThunk(
  'auth/sendPhoneOtp',
  async (phone: string, { rejectWithValue }) => {
    // This thunk is kept for consistency, but in reality,
    // OTP sending should be handled entirely in the component
    // We'll just store the pending phone number
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;
      localStorage.setItem('pendingPhone', formattedPhone);
      return { phone: formattedPhone };
    } catch (error: any) {
      return rejectWithValue('Failed to prepare phone verification');
    }
  }
);


export const verifyPhoneOtp = createAsyncThunk(
  'auth/verifyPhoneOtp',
  async (payload: { idToken: string; name?: string; company?: string }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/phone/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // ✅ Save token
      localStorage.setItem('token', response.data.token);
      
      // ✅ Return full user data (must match your User interface)
      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loginWithPhone = createAsyncThunk(
  'auth/loginWithPhone',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/phone/login', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Phone login failed');
    }
  }
);

// Existing async thunks (email/password auth)
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      let locationData;
      try {
        locationData = await getUserLocationData();
      } catch (error) {
        console.warn('Could not get location data, using fallback:', error);
        locationData = getFallbackLocationData();
      }

      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          ...credentials,
          location: locationData
        }),
      });

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      let locationData;
      try {
        locationData = await getUserLocationData();
      } catch (error) {
        console.warn('Could not get location data, using fallback:', error);
        locationData = getFallbackLocationData();
      }

      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          location: locationData
        }),
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const sendEmailOtp = createAsyncThunk(
  'auth/sendEmailOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await apiCall('/auth/send-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid OTP');
    }
  }
);

export const sendPasswordOtp = createAsyncThunk(
  'auth/sendPasswordOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await apiCall('/auth/password/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send password OTP');
    }
  }
);

export const resetPasswordWithOtp = createAsyncThunk(
  'auth/resetPasswordWithOtp',
  async (payload: { email: string; otp: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await apiCall('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
      return { message: 'Password changed successfully' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

export const validateTokenAndLogout = createAsyncThunk(
  'auth/validateToken',
  async (_, { dispatch, getState }) => {
    const state = getState() as { auth: AuthState };
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
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingEmail = undefined;
      state.pendingPhone = undefined;
      localStorage.removeItem('token');
      localStorage.removeItem('phoneVerificationId');
      localStorage.removeItem('pendingPhone');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
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
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.pendingEmail = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingEmail = action.payload.user?.email;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      })
      // Validate Token
      .addCase(validateTokenAndLogout.fulfilled, (state, action) => {
        if (!action.payload.isValid) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
          localStorage.removeItem('token');
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
      })
      .addCase(verifyPhoneOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;