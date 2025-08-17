import BaseApi from "./baseApi"

class McaApi extends BaseApi {
  async cinByPan(data: any): Promise<any> {
    return this.post("/mca/cin-by-pan", data)
  }

  async dinByPan(data: any): Promise<any> {
    return this.post("/mca/din-by-pan", data)
  }

  async fetchCompany(data: any): Promise<any> {
    return this.post("/mca/fetch-company", data)
  }

  // Expose a public post for generic endpoints
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config)
  }
}

export const mcaApi = new McaApi("/api")

