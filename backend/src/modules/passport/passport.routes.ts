import { Router } from 'express';
import {
  generateMrzHandler,
  verifyMrzHandler,
  verifyPassportHandler,
  fetchPassportDetailsHandler,
  extractPassportOcrDataHandler,
} from './passport.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();

/**
 * Passport Verification APIs
 */

// Generate MRZ (Machine Readable Zone)
router.post('/mrz/generate', authenticate, requireUser, generateMrzHandler);

// Verify MRZ against passport details
router.post('/mrz/verify', authenticate, requireUser, verifyMrzHandler);

// Verify passport details against government database
router.post('/verify', authenticate, requireUser, verifyPassportHandler);

// Fetch passport details using file number and date of birth
router.post('/fetch', authenticate, requireUser, fetchPassportDetailsHandler);

// Extract data from passport using OCR
router.post('/ocr', authenticate, requireUser, extractPassportOcrDataHandler);

export default router;