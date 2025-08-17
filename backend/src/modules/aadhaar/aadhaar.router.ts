import { Router } from 'express';
import multer from 'multer';
import { aadhaarOcrV1Handler, aadhaarOcrV2Handler, fetchEAadhaarHandler } from './aadhaar.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();
const upload = multer();

// Aadhaar OCR V1 (base64 image)
router.post('/ocr-v1', authenticate, requireUser, aadhaarOcrV1Handler);

// Aadhaar OCR V2 (file upload)
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

export default router;
