import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { BankAccountService } from './bankaccount.service';
import {
  BankAccountVerifyRequest,
  IfscValidateRequest,
  UpiVerifyRequest,
} from '../../common/validation/schemas';
import { logger } from '../../common/utils/logger';

const service = new BankAccountService();

// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
// POST /api/bankaccount/verify
// Body: { account_number: string, ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
export const verifyBankAccountHandler = asyncHandler(
  async (req: Request<{}, {}, BankAccountVerifyRequest>, res: Response) => {
    const { account_number, ifsc, consent } = req.body;
    const maskedAcc = account_number.replace(/.(?=.{4})/g, 'X');
    logger.info('[BankAccount] Incoming verify request', {
      account_number: maskedAcc,
      ifsc,
      consent,
    });

    const result = await service.verify(req.body);
    logger.info('[BankAccount] Provider response', {
      status: (result as any)?.status,
      code: (result as any)?.data?.code,
      message: (result as any)?.data?.message,
    });
    res.json(result);
  },
);

// POST /api/bankaccount/verify-ifsc
// Body: { ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
// POST /api/bankaccount/verify-ifsc
// Body: { ifsc: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
export const verifyIfscHandler = asyncHandler(
  async (req: Request<{}, {}, IfscValidateRequest>, res: Response) => {
    const { ifsc, consent } = req.body; // Typed by Zod
    logger.info('[BankAccount] Incoming IFSC validate request', { ifsc, consent });

    const result = await service.validateIfsc(req.body);
    logger.info('[BankAccount] IFSC Provider response', {
      status: (result as any)?.status,
      code: (result as any)?.data?.code,
      message: (result as any)?.data?.message,
    });
    res.json(result);
  },
);

// POST /api/bankaccount/verify-upi
// Body: { upi: string, consent: 'Y' | 'N' } or { vpa: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
// Validation schema normalizes 'vpa' to 'upi' for compatibility
// POST /api/bankaccount/verify-upi
// Body: { upi: string, consent: 'Y' | 'N' } or { vpa: string, consent: 'Y' | 'N' }
// Note: This endpoint does not require authentication (public API)
// Validation schema normalizes 'vpa' to 'upi' for compatibility
export const verifyUpiHandler = asyncHandler(
  async (req: Request<{}, {}, UpiVerifyRequest>, res: Response) => {
    const { upi, consent } = req.body;

    // Mask UPI ID for logging (show only first 3 chars and last domain part)
    const maskedUpi =
      upi.split('@')[0].substring(0, 3) + '***@' + upi.split('@')[1];
    logger.info('[BankAccount] Incoming UPI verify request', { upi: maskedUpi, consent });

    const result = await service.verifyUpi(req.body);
    logger.info('[BankAccount] UPI Provider response', {
      status: (result as any)?.status,
      code: (result as any)?.data?.code,
      message: (result as any)?.data?.message,
    });
    res.json(result);
  },
);
