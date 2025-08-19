import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { BankAccountService } from './bankaccount.service';

const service = new BankAccountService();

// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
export const verifyBankAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  const { account_number, ifsc, consent } = (req.body || {}) as {
    account_number?: string
    ifsc?: string
    consent?: 'Y' | 'N'
  }
  const maskedAcc = typeof account_number === 'string' ? account_number.replace(/.(?=.{4})/g, 'X') : undefined
  console.info('[BankAccount] Incoming verify request', { account_number: maskedAcc, ifsc, consent })

  const result = await service.verify(req.body);
  console.info('[BankAccount] Provider response', {
    status: (result as any)?.status,
    code: (result as any)?.data?.code,
    message: (result as any)?.data?.message,
  })
  res.json(result);
});


