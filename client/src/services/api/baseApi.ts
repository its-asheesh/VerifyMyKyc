import axios from "axios";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import { validateToken } from "../../utils/tokenUtils";
import { getTokenCookie, areCookiesSupported } from "../../utils/cookieUtils";
class BaseApi {
  protected api: ReturnType<typeof axios.create>

  constructor(baseURL = "/api") {
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig & { skipAuth?: boolean }) => {
        // Allow callers to skip auth for public endpoints
        if (!config.skipAuth) {
          // Try to get token from cookies first, then localStorage
          let token = null;

          if (areCookiesSupported()) {
            token = getTokenCookie();
          }

          if (!token) {
            token = localStorage.getItem("token");
          }

          if (token) {
            // Validate token before sending request
            const { isValid } = validateToken(token);
            if (!isValid) {
              // Try to refresh token before giving up
              try {
                const refreshResponse = await fetch("/api/auth/refresh", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token }),
                });

                if (refreshResponse.ok) {
                  const refreshData = await refreshResponse.json();
                  const newToken = refreshData.data.token;

                  // Update token in both storage methods
                  localStorage.setItem("token", newToken);
                  if (areCookiesSupported()) {
                    import("../../utils/cookieUtils").then(({ setTokenCookie }) => {
                      setTokenCookie(newToken, true);
                    });
                  }

                  config.headers.Authorization = `Bearer ${newToken}`;
                  return config;
                }
              } catch {
                // Refresh failed, proceed with cleanup
              }

              // Token is expired and refresh failed, clear it from both storage methods and redirect to login
              localStorage.removeItem("token");
              if (areCookiesSupported()) {
                import("../../utils/cookieUtils").then(({ removeTokenCookie }) => {
                  removeTokenCookie();
                });
              }
              if (window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
              return Promise.reject(new Error("Token expired"));
            }
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error: unknown) => Promise.reject(error),
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Invalid token - clear auth state and redirect to login
          localStorage.removeItem("token")

          // Also clear cookies if supported
          if (areCookiesSupported()) {
            const { removeTokenCookie } = await import("../../utils/cookieUtils")
            removeTokenCookie()
          }

          // Clear Redux auth state
          try {
            const { store } = await import("../../redux/store")
            const { logout } = await import("../../redux/slices/authSlice")
            store.dispatch(logout())
          } catch {
            // Store not initialized yet, ignore
          }

          // Redirect to login page if not already there
          if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.href = "/login"
          }
        }

        // Prefer backend-provided message if available
        const data = error?.response?.data as { message?: string; error?: { message?: string } | string } | undefined;
        const backendMessage =
          data?.message ||
          (typeof data?.error === 'object' ? data?.error?.message : data?.error) ||
          null
        if (backendMessage && typeof backendMessage === "string") {
          error.message = backendMessage
        }
        return Promise.reject(error)
      },
    )
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig & { skipAuth?: boolean }): Promise<T> {
    return (await this.api.get<T>(url, config)).data as T
  }

  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.post<T>(url, data, config)).data as T
  }

  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.put<T>(url, data, config)).data as T
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.api.delete<T>(url, config)).data as T
  }
}

export default BaseApi
