import { Router } from 'express';
import multer from 'multer';
import { drivingLicenseOcrHandler, fetchDrivingLicenseDetailsHandler } from './drivinglicense.controller';

const router = Router();
const upload = multer();

// Driving License OCR (multipart/form-data)
router.post('/ocr', upload.fields([{ name: 'file_front', maxCount: 1 }, { name: 'file_back', maxCount: 1 }]), drivingLicenseOcrHandler);

// Fetch Driving License Details (JSON)
router.post('/fetch-details', fetchDrivingLicenseDetailsHandler);

export default router; 