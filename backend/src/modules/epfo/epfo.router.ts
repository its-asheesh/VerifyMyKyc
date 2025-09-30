import { Router } from 'express';
import {
  fetchUanHandler,
  generateOtpHandler,
  validateOtpHandler,
  listEmployersHandler,
  fetchPassbookHandler,
  employmentByUanHandler,
  employmentLatestHandler,
  uanByPanHandler,
  employerVerifyHandler,
} from './epfo.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();

// Fetch UAN(s) by mobile and optional PAN
router.post('/fetch-uan', authenticate, requireUser, fetchUanHandler);

// Passbook V1 flow
router.post('/passbook/generate-otp', authenticate, requireUser, generateOtpHandler);
router.post('/passbook/validate-otp', authenticate, requireUser, validateOtpHandler);
router.get('/passbook/employers', authenticate, requireUser, listEmployersHandler);
router.post('/passbook/fetch', authenticate, requireUser, fetchPassbookHandler);

// Employment history
router.post('/employment-history/fetch-by-uan', authenticate, requireUser, employmentByUanHandler);
router.post('/employment-history/fetch-latest', authenticate, requireUser, employmentLatestHandler);

// UAN by PAN
router.post('/uan/fetch-by-pan', authenticate, requireUser, uanByPanHandler);

// Employer verify
router.post('/employer-verify', authenticate, requireUser, employerVerifyHandler);

export default router;


