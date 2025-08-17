import { Router } from 'express';
import multer from 'multer';
import { drivingLicenseOcrHandler, fetchDrivingLicenseDetailsHandler } from './drivinglicense.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();
const upload = multer();

// Driving License OCR (multipart/form-data)
router.post(
  '/ocr',
  authenticate,
  requireUser,
  upload.fields([{ name: 'file_front', maxCount: 1 }, { name: 'file_back', maxCount: 1 }]),
  drivingLicenseOcrHandler
);

// Fetch Driving License Details (JSON)
router.post('/fetch-details', authenticate, requireUser, fetchDrivingLicenseDetailsHandler);

export default router;