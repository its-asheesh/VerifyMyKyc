import { Router } from 'express';
import {
  verifyBankAccountHandler,
  verifyIfscHandler,
  verifyUpiHandler,
} from './bankaccount.controller';
import { validate } from '../../common/validation/middleware';
import {
  bankAccountVerifySchema,
  ifscValidateSchema,
  upiVerifySchema,
} from '../../common/validation/schemas';

const router = Router();

// POST /api/bankaccount/verify
// Validates request body using Zod schema before processing
router.post('/verify', validate(bankAccountVerifySchema), verifyBankAccountHandler);

// POST /api/bankaccount/verify-ifsc
// Validates IFSC code and fetches bank/branch details
router.post('/verify-ifsc', validate(ifscValidateSchema), verifyIfscHandler);

// POST /api/bankaccount/verify-upi
// Verifies UPI ID (VPA) and fetches account holder name
router.post('/verify-upi', validate(upiVerifySchema), verifyUpiHandler);

export default router;
