import axios from "axios";
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
      (config: any) => {
        // Allow callers to skip auth for public endpoints
        if (!(config as any)?.skipAuth) {
          const token = localStorage.getItem("token")
          if (token) {
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
