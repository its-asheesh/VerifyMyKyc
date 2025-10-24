import axios from "axios";
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
      async (config: any) => {
        // Allow callers to skip auth for public endpoints
        if (!(config as any)?.skipAuth) {
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
              } catch (refreshError) {
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
      (error: any) => Promise.reject(error),
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          const cfg = (error as any)?.config || {}
          const skipAuth = !!(cfg as any)?.skipAuth
          const requireAuth = !!(cfg as any)?.requireAuth
          const sentAuthHeader = !!cfg?.headers?.Authorization
          const method = (cfg?.method || 'get').toLowerCase()
          // Force logout only when request required auth, or it sent auth header and wasn't a public/GET
          if (requireAuth || (!skipAuth && sentAuthHeader && method !== 'get')) {
            localStorage.removeItem("token")
            if (window.location.pathname !== "/login") {
              window.location.href = "/login"
            }
            return Promise.reject(error)
          }
          // For public/unauthenticated requests, surface the error to the caller without redirect
        }
        // Prefer backend-provided message if available
        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.response?.data?.error ||
          null
        if (backendMessage && typeof backendMessage === "string") {
          error.message = backendMessage
        }
        return Promise.reject(error)
      },
    )
  }

  protected async get<T>(url: string, config?: any): Promise<T> {
    return (await this.api.get<T>(url, config)).data as T
  }

  protected async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return (await this.api.post<T>(url, data, config)).data as T
  }

  protected async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return (await this.api.put<T>(url, data, config)).data as T
  }

  protected async delete<T>(url: string, config?: any): Promise<T> {
    return (await this.api.delete<T>(url, config)).data as T
  }
}

export default BaseApi
