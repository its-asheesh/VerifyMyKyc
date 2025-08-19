import BaseApi from "./baseApi"
import type { Solution, Industry } from "../../types/solution"
import type { ApiResponse } from "../../types/common"
import { solutionsFallback, industriesFallback } from "../../utils/solutionsFallback"

class SolutionApi extends BaseApi {
  async getSolutions(industry?: string): Promise<ApiResponse<Solution[]>> {
    try {
      return await this.get("/solutions", { params: { industry } })
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const data = (industry
          ? solutionsFallback.filter((s) => s.industry.id === industry)
          : solutionsFallback) as Solution[]
        return { data, message: "fallback: solutions", success: true }
      }
      throw error
    }
  }

  async getSolutionById(id: string): Promise<ApiResponse<Solution>> {
    try {
      return await this.get(`/solutions/${id}`)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const found = solutionsFallback.find((s) => s.id === id)
        if (found) {
          return { data: found, message: "fallback: solution", success: true }
        }
      }
      throw error
    }
  }

  async getIndustries(): Promise<ApiResponse<Industry[]>> {
    try {
      return await this.get("/solutions/industries")
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { data: industriesFallback as Industry[], message: "fallback: industries", success: true }
      }
      throw error
    }
  }
}

export const solutionApi = new SolutionApi()
