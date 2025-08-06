import { Router } from 'express';
import multer from 'multer';
import { aadhaarOcrV1Handler, aadhaarOcrV2Handler, fetchEAadhaarHandler } from './aadhaar.controller';

const router = Router();
const upload = multer();

// Aadhaar OCR V1 (base64 image)
router.post('/ocr-v1', aadhaarOcrV1Handler);

// Aadhaar OCR V2 (file upload)
router.post('/ocr-v2', upload.fields([
  { name: 'file_front', maxCount: 1 },
  { name: 'file_back', maxCount: 1 },
]), aadhaarOcrV2Handler);

router.post('/fetch-eaadhaar', fetchEAadhaarHandler);

export default router;
