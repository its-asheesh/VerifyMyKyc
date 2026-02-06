import { Router } from 'express';
import multer from 'multer';
import {
  voterBosonFetchHandler,
  voterMesonInitHandler,
  voterMesonFetchHandler,
  voterOcrHandler,
} from './voter.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();
const upload = multer();

// Boson: Direct fetch
router.post('/boson/fetch', authenticate, requireUser, voterBosonFetchHandler);

// Meson: Init (captcha)
router.get('/meson/init', authenticate, requireUser, voterMesonInitHandler);

// Meson: Fetch with captcha
router.post('/meson/fetch', authenticate, requireUser, voterMesonFetchHandler);

// OCR: multipart/form-data
router.post(
  '/ocr',
  authenticate,
  requireUser,
  upload.fields([
    { name: 'file_front', maxCount: 1 },
    { name: 'file_back', maxCount: 1 },
  ]),
  voterOcrHandler,
);

export default router;
