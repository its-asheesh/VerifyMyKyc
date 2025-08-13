import BaseApi from "./baseApi"

export interface BankAccountVerifyRequest {
  account_number: string
  ifsc: string
  consent: "Y" | "N"
}

export interface BankAccountVerifyResponse {
  status: number
  data: {
    code: string
    message: string
    bank_account_data?: any
    [key: string]: any
  }
  [key: string]: any
}

class BankingApi extends BaseApi {
  async verifyBankAccount(data: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
    return this.post("/bankaccount/verify", data)
  }
}

export const bankingApi = new BankingApi("/api")


