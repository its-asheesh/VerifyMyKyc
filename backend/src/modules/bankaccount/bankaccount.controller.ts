import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { BankAccountService } from './bankaccount.service';

const service = new BankAccountService();

// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
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

// POST /api/bankaccount/verify-ifsc
// Body: { ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
export const verifyIfscHandler = asyncHandler(async (req: Request, res: Response) => {
  const { ifsc, consent } = (req.body || {}) as {
    ifsc?: string
    consent?: 'Y' | 'N'
  }
  console.info('[BankAccount] Incoming IFSC validate request', { ifsc, consent })

  const result = await service.validateIfsc(req.body);
  console.info('[BankAccount] IFSC Provider response', {
    status: (result as any)?.status,
    code: (result as any)?.data?.code,
    message: (result as any)?.data?.message,
  })
  res.json(result);
});

// POST /api/bankaccount/verify-upi
// Body: { upi: string, consent: 'Y' | 'N' } or { vpa: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
// Validation schema normalizes 'vpa' to 'upi' for compatibility
export const verifyUpiHandler = asyncHandler(async (req: Request, res: Response) => {
  const { upi, consent } = req.body as {
    upi: string
    consent: 'Y' | 'N'
  }
  
  // Mask UPI ID for logging (show only first 3 chars and last domain part)
  const maskedUpi = typeof upi === 'string' 
    ? upi.split('@')[0].substring(0, 3) + '***@' + upi.split('@')[1] 
    : undefined
  console.info('[BankAccount] Incoming UPI verify request', { upi: maskedUpi, consent })

  const result = await service.verifyUpi(req.body);
  console.info('[BankAccount] UPI Provider response', {
    status: (result as any)?.status,
    code: (result as any)?.data?.code,
    message: (result as any)?.data?.message,
  })
  res.json(result);
});


