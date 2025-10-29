import { Router } from 'express';
import multer from 'multer';
import { 
  aadhaarOcrV1Handler, 
  aadhaarOcrV2Handler, 
  fetchEAadhaarHandler,
  generateOtpV2Handler,
  submitOtpV2Handler
} from './aadhaar.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';
import { validate } from '../../common/validation/middleware';
import { otpLimiter, apiLimiter } from '../../common/middleware/rateLimiter';
import {
  aadhaarGenerateOtpV2Schema,
  aadhaarSubmitOtpV2Schema,
} from '../../common/validation/schemas';

const router = Router();
const upload = multer();

// Legacy Aadhaar OCR endpoints (kept for backward compatibility)
router.post('/ocr-v1', authenticate, requireUser, aadhaarOcrV1Handler);

router.post(
  '/ocr-v2',
  authenticate,
  requireUser,
  upload.fields([
    { name: 'file_front', maxCount: 1 },
    { name: 'file_back', maxCount: 1 },
  ]),
  aadhaarOcrV2Handler
);

router.post('/fetch-eaadhaar', authenticate, requireUser, fetchEAadhaarHandler);

// QuickEKYC Aadhaar V2 Endpoints (New Implementation)
router.post(
  '/v2/generate-otp',
  authenticate,
  requireUser,
  otpLimiter,
  validate(aadhaarGenerateOtpV2Schema),
  generateOtpV2Handler
);

router.post(
  '/v2/submit-otp',
  authenticate,
  requireUser,
  apiLimiter,
  validate(aadhaarSubmitOtpV2Schema),
  submitOtpV2Handler
);

export default router;
