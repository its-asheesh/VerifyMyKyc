import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { BankAccountService } from './bankaccount.service';

const service = new BankAccountService();

// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
export const verifyBankAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.verify(req.body);
  res.json(result);
});


