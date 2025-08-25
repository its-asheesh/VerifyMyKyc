// passport.controller.ts

import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { PassportService } from './passport.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new PassportService();

// POST /api/passport/mrz/generate
export const generateMrzHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const {
    country_code,
    passport_number,
    surname,
    given_name,
    gender,
    date_of_birth,
    date_of_expiry,
    consent
  } = req.body || {};

  if (!country_code || !passport_number || !surname || !given_name || !gender || !date_of_birth || !date_of_expiry || !consent) {
    return res.status(400).json({
      message: 'All fields (country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, consent) are required'
    });
  }

  console.log('Generate MRZ Controller: incoming request', {
    userId,
    country_code,
    passport_number,
    surname,
    hasConsent: Boolean(consent),
  });

  const order = await ensureVerificationQuota(userId, 'passport');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  const result = await service.generateMrz({
    country_code,
    passport_number,
    surname,
    given_name,
    gender,
    date_of_birth,
    date_of_expiry,
    consent,
  });
  await consumeVerificationQuota(order);

  console.log('Generate MRZ Controller: consumed 1 verification', {
    orderId: order.orderId,
    newRemaining: order?.verificationQuota?.remaining,
  });

  res.json(result);
});

// POST /api/passport/mrz/verify
export const verifyMrzHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const {
    country_code,
    passport_number,
    surname,
    given_name,
    gender,
    date_of_birth,
    date_of_expiry,
    mrz_first_line,
    mrz_second_line,
    consent
  } = req.body || {};

  if (!country_code || !passport_number || !surname || !given_name || !gender || !date_of_birth || !date_of_expiry || !mrz_first_line || !mrz_second_line || !consent) {
    return res.status(400).json({
      message: 'All fields (country_code, passport_number, surname, given_name, gender, date_of_birth, date_of_expiry, mrz_first_line, mrz_second_line, consent) are required'
    });
  }

  console.log('Verify MRZ Controller: incoming request', {
    userId,
    country_code,
    passport_number,
    surname,
    hasConsent: Boolean(consent),
  });

  const order = await ensureVerificationQuota(userId, 'passport');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  const result = await service.verifyMrz({
    country_code,
    passport_number,
    surname,
    given_name,
    gender,
    date_of_birth,
    date_of_expiry,
    mrz_first_line,
    mrz_second_line,
    consent,
  });
  await consumeVerificationQuota(order);

  res.json(result);
});

// POST /api/passport/verify
export const verifyPassportHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const {
    file_number,
    passport_number,
    surname,
    given_name,
    date_of_birth,
    consent
  } = req.body || {};

  if (!file_number || !passport_number || !surname || !given_name || !date_of_birth || !consent) {
    return res.status(400).json({
      message: 'All fields (file_number, passport_number, surname, given_name, date_of_birth, consent) are required'
    });
  }

  console.log('Verify Passport Controller: incoming request', {
    userId,
    file_number,
    passport_number,
    surname,
    hasConsent: Boolean(consent),
  });

  const order = await ensureVerificationQuota(userId, 'passport');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  const result = await service.verifyPassport({
    file_number,
    passport_number,
    surname,
    given_name,
    date_of_birth,
    consent,
  });
  await consumeVerificationQuota(order);

  res.json(result);
});

// POST /api/passport/fetch
export const fetchPassportDetailsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { file_number, date_of_birth, consent } = req.body || {};

  if (!file_number || !date_of_birth || !consent) {
    return res.status(400).json({
      message: 'file_number, date_of_birth, and consent are required'
    });
  }

  console.log('Fetch Passport Details Controller: incoming request', {
    userId,
    file_number,
    date_of_birth,
    hasConsent: Boolean(consent),
  });

  const order = await ensureVerificationQuota(userId, 'passport');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  const result = await service.fetchPassportDetails({
    file_number,
    date_of_birth,
    consent,
  });
  await consumeVerificationQuota(order);

  res.json(result);
});

// POST /api/passport/ocr
export const extractPassportOcrDataHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { consent } = req.body;
  
  // Properly handle multer files with robust typing
  const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
  
  let file_front: Express.Multer.File | undefined;
  let file_back: Express.Multer.File | undefined;

  // Handle both array and object formats of files
  if (Array.isArray(files)) {
    file_front = files[0];
  } else if (files && typeof files === 'object') {
    file_front = files['file_front']?.[0];
    file_back = files['file_back']?.[0];
  }

  if (!file_front || !consent) {
    return res.status(400).json({
      message: 'file_front and consent are required'
    });
  }

  console.log('Extract Passport OCR Data Controller: incoming request', {
    userId,
    hasFileFront: !!file_front,
    hasFileBack: !!file_back,
    hasConsent: Boolean(consent),
  });

  const order = await ensureVerificationQuota(userId, 'passport');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  // ABSOLUTELY CORRECT BUFFER TO BLOB CONVERSION
  const convertToBlob = (file: Express.Multer.File): Blob => {
    // Handle different buffer types properly
    let arrayBuffer: ArrayBuffer;
    
    if (file.buffer instanceof Buffer) {
      // Convert Buffer to ArrayBuffer
      arrayBuffer = file.buffer.buffer.slice(
        file.buffer.byteOffset,
        file.buffer.byteOffset + file.buffer.length
      ) as ArrayBuffer;
    } else if (file.buffer instanceof ArrayBuffer) {
      // Already an ArrayBuffer
      arrayBuffer = file.buffer;
    } else {
      // Fallback - convert to Buffer then to ArrayBuffer
      const buf = Buffer.from(file.buffer);
      arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length) as ArrayBuffer;
    }
    
    return new Blob([arrayBuffer], { type: file.mimetype });
  };

  const result = await service.extractPassportOcrData({
    file_front: convertToBlob(file_front),
    file_back: file_back ? convertToBlob(file_back) : undefined,
    consent,
  });
  await consumeVerificationQuota(order);

  res.json(result);
});