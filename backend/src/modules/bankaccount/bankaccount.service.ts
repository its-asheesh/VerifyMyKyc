import { 
  BankAccountVerifyRequest, 
  BankAccountVerifyResponse,
  IfscValidateRequest,
  IfscValidateResponse,
  UpiVerifyRequest,
  UpiVerifyResponse
} from '../../common/types/bank';
import { verifyBankAccountProvider } from './providers/verify.provider';
import { verifyIfscProvider } from './providers/verify-ifsc.provider';
import { verifyUpiProvider } from './providers/verify-upi.provider';

export class BankAccountService {
  async verify(payload: BankAccountVerifyRequest): Promise<BankAccountVerifyResponse> {
    return verifyBankAccountProvider(payload);
  }

  async validateIfsc(payload: IfscValidateRequest): Promise<IfscValidateResponse> {
    return verifyIfscProvider(payload);
  }

  async verifyUpi(payload: UpiVerifyRequest): Promise<UpiVerifyResponse> {
    return verifyUpiProvider(payload);
  }
}


