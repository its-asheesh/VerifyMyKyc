import { Router } from 'express';
import { verifyBankAccountHandler } from './bankaccount.controller';

const router = Router();

// POST /api/bankaccount/verify
router.post('/verify', verifyBankAccountHandler);

export default router;


