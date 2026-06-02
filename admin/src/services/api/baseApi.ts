import axios from "axios";
import { validateToken } from "../../utils/tokenUtils";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

class BaseApi {
  protected api: AxiosInstance

  constructor(baseURL = "/api") {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("adminToken")
        if (token) {
          // Validate token before sending request
          const { isValid } = validateToken(token);
          if (!isValid) {
            // Token is expired, clear it and redirect to login
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired"));
          }
          config.headers.Authorization = `Bearer ${token}`
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
          localStorage.removeItem("adminToken")
          window.location.href = "/login"
        }
        return Promise.reject(error)
      },
    )
  }

  public async get<T>(url: string, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config)
    return response.data
  }
}

export default BaseApi 