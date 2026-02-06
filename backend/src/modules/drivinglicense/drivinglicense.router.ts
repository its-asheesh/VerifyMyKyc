import { Router } from 'express';
import multer from 'multer';
import {
  drivingLicenseOcrHandler,
  fetchDrivingLicenseDetailsHandler,
} from './drivinglicense.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';
import { validate } from '../../common/validation/middleware';
import { drivingLicenseSchema, ocrSchema } from '../../common/validation/schemas';

const router = Router();
const upload = multer();

// Driving License OCR (multipart/form-data)
router.post(
  '/ocr',
  authenticate,
  requireUser,
  upload.fields([
    { name: 'file_front', maxCount: 1 },
    { name: 'file_back', maxCount: 1 },
  ]),
  // validate(ocrSchema), // Multer handles body parsing, but validate expects json body. 
  // ensure validate works with multer populated body? Yes express populates req.body.
  // Validate consent after files upload
  validate(ocrSchema),
  drivingLicenseOcrHandler,
);

// Fetch Driving License Details (JSON)
router.post('/fetch-details', authenticate, requireUser, validate(drivingLicenseSchema), fetchDrivingLicenseDetailsHandler);

export default router;
