import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getUserLocationData, getFallbackLocationData } from "../../utils/locationUtils"
import { validateToken } from "../../utils/tokenUtils"

// Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin'
  company?: string
  phone?: string
  lastLogin?: string
  emailVerified?: boolean
  location?: {
    country?: string
    city?: string
    region?: string
    timezone?: string
    ipAddress?: string
  }
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  company?: string
  phone?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  pendingEmail?: string
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
    };
  }

  const { isValid, payload } = validateToken(token);
  
  if (!isValid) {
    // Token is expired or invalid, clear it
    localStorage.removeItem('token');
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }

  // Token is valid, set authenticated state
  return {
    user: null, // Will be fetched from API
    token,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  };
};

// Initial state
const initialState: AuthState = initializeAuthState();

// API base URL
// In dev, set VITE_API_URL=/api to use Vite proxy and avoid CORS
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }

  return data
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Get location data
      let locationData
      try {
        locationData = await getUserLocationData()
      } catch (error) {
        console.warn('Could not get location data, using fallback:', error)
        locationData = getFallbackLocationData()
      }

      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          ...credentials,
          location: locationData
        }),
      })

      // Store token
      localStorage.setItem('token', response.data.token)

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // Get location data
      let locationData
      try {
        locationData = await getUserLocationData()
      } catch (error) {
        console.warn('Could not get location data, using fallback:', error)
        locationData = getFallbackLocationData()
      }

      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...userData,
          location: locationData
        }),
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

export const sendEmailOtp = createAsyncThunk(
  'auth/sendEmailOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await apiCall('/auth/send-email-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      return true
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP')
    }
  }
)

export const verifyEmailOtp = createAsyncThunk(
  'auth/verifyEmailOtp',
  async (payload: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      // Store token
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid OTP')
    }
  }
)

export const sendPasswordOtp = createAsyncThunk(
  'auth/sendPasswordOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      await apiCall('/auth/password/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      return true
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send password OTP')
    }
  }
)

export const resetPasswordWithOtp = createAsyncThunk(
  'auth/resetPasswordWithOtp',
  async (payload: { email: string; otp: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      // Store token
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/profile')
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      })
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile')
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await apiCall('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      })
      return { message: 'Password changed successfully' }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password')
    }
  }
)

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
      // Token is expired, logout user
      dispatch(logout());
      return { isValid: false };
    }

    return { isValid: true };
  }
)

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload)
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
  .addCase(loginUser.pending, (state) => {
    state.isLoading = true
    state.error = null
  })
  .addCase(loginUser.fulfilled, (state, action) => {
    state.isLoading = false
    state.isAuthenticated = true
    state.user = action.payload.user
    state.token = action.payload.token
    state.error = null
    state.pendingEmail = undefined // 👈 ADD THIS LINE
  })
  .addCase(loginUser.rejected, (state, action) => {
    state.isLoading = false
    state.error = action.payload as string
  })
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        // Registration now requires email verification; do not authenticate yet
        state.pendingEmail = action.payload.user?.email
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Send Email OTP
    builder
      .addCase(sendEmailOtp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendEmailOtp.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Verify Email OTP
    builder
      .addCase(verifyEmailOtp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.pendingEmail = undefined
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Password reset send OTP
    builder
      .addCase(sendPasswordOtp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendPasswordOtp.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(sendPasswordOtp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Reset password with OTP
    builder
      .addCase(resetPasswordWithOtp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPasswordWithOtp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(resetPasswordWithOtp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Validate Token
    builder
      .addCase(validateTokenAndLogout.fulfilled, (state, action) => {
        if (!action.payload.isValid) {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          state.error = null
          localStorage.removeItem('token')
        }
      })
  },
})

export const { logout, clearError, setToken } = authSlice.actions
export default authSlice.reducer