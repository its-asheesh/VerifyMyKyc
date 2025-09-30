import BaseApi from "./baseApi"

class EpfoApi extends BaseApi {
  // Fetch UAN by mobile and optional PAN
  async fetchUan(data: { mobile_number: string; pan?: string; consent: string }): Promise<any> {
    return this.post("/epfo/fetch-uan", data)
  }

  // Passbook V1 flow
  async generateOtp(data: { uan: string; consent: string }): Promise<any> {
    return this.post("/epfo/passbook/generate-otp", data)
  }
  async validateOtp(transactionId: string, data: { otp: string }): Promise<any> {
    return this.post("/epfo/passbook/validate-otp", data, { headers: { "X-Transaction-ID": transactionId } })
  }
  async listEmployers(transactionId: string): Promise<any> {
    return this.get("/epfo/passbook/employers", { headers: { "X-Transaction-ID": transactionId } })
  }
  async fetchPassbook(transactionId: string, data: { member_id: string; office_id: string }): Promise<any> {
    return this.post("/epfo/passbook/fetch", data, { headers: { "X-Transaction-ID": transactionId } })
  }

  // Employment history
  async employmentByUan(data: { uan_number: string; consent: string }): Promise<any> {
    return this.post("/epfo/employment-history/fetch-by-uan", data)
  }
  async employmentLatest(data: { uan: string; consent: string }): Promise<any> {
    return this.post("/epfo/employment-history/fetch-latest", data)
  }

  // UAN by PAN
  async uanByPan(data: { pan_number: string; consent: string }): Promise<any> {
    return this.post("/epfo/uan/fetch-by-pan", data)
  }

  // Employer verify
  async employerVerify(data: { employer_name: string; consent: string }): Promise<any> {
    return this.post("/epfo/employer-verify", data)
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config)
  }
  public async get<T>(url: string, config?: any): Promise<T> {
    return super.get<T>(url, config)
  }
}

export const epfoApi = new EpfoApi("/api")


