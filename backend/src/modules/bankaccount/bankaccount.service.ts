import { BankAccountVerifyRequest, BankAccountVerifyResponse } from '../../common/types/bank';
import { verifyBankAccountProvider } from './providers/verify.provider';

export class BankAccountService {
  async verify(payload: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
    return verifyBankAccountProvider(payload);
  }
}


