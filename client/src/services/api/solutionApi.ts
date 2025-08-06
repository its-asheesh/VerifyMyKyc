import BaseApi from "./baseApi"
import type { Solution, Industry } from "../../types/solution"
import type { ApiResponse } from "../../types/common"

class SolutionApi extends BaseApi {
  async getSolutions(industry?: string): Promise<ApiResponse<Solution[]>> {
    return this.get("/solutions", { params: { industry } })
  }

  async getSolutionById(id: string): Promise<ApiResponse<Solution>> {
    return this.get(`/solutions/${id}`)
  }

  async getIndustries(): Promise<ApiResponse<Industry[]>> {
    return this.get("/solutions/industries")
  }
}

export const solutionApi = new SolutionApi()
