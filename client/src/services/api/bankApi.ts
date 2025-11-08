import BaseApi from "./baseApi"
import type {
  BankAccountVerifyRequest,
  BankAccountVerifyResponse,
  IfscValidateRequest,
  IfscValidateResponse,
  UpiVerifyRequest,
  UpiVerifyResponse,
} from "../../types/kyc"

class BankApi extends BaseApi {
  async verifyAccount(data: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
    // Backend mounts at /api/bankaccount/verify
    return this.post<BankAccountVerifyResponse>("/bankaccount/verify", data)
  }
  async validateIfsc(data: IfscValidateRequest): Promise<IfscValidateResponse> {
    // Backend mounts at /api/bankaccount/verify-ifsc
    return this.post<IfscValidateResponse>("/bankaccount/verify-ifsc", data)
  }
  async verifyUpi(data: UpiVerifyRequest): Promise<UpiVerifyResponse> {
    // Backend mounts at /api/bankaccount/verify-upi
    return this.post<UpiVerifyResponse>("/bankaccount/verify-upi", data)
  }
  // Expose a public post method for generic use
  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return super.post<T>(url, data, config)
  }
}

export const bankApi = new BankApi("/api")
