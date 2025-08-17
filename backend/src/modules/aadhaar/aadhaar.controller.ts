import { Request, Response } from 'express';
import { AadhaarService } from './aadhaar.service';
import asyncHandler from '../../common/middleware/asyncHandler';
import { FetchEAadhaarRequest } from '../../common/types/eaadhaar';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new AadhaarService();

// POST /api/aadhaar/ocr-v1
export const aadhaarOcrV1Handler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'aadhaar');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const { base64_data, consent } = req.body;
  const result = await service.ocrV1(base64_data, consent);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/aadhaar/ocr-v2
export const aadhaarOcrV2Handler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { consent } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const file_front = files?.file_front?.[0];
  const file_back = files?.file_back?.[0];
  if (!file_front) throw new Error('file_front is required');
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'aadhaar');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.ocrV2(
    file_front.buffer,
    file_front.originalname,
    consent,
    file_back?.buffer,
    file_back?.originalname
  );
  await consumeVerificationQuota(order);
  res.json(result);
});

export const fetchEAadhaarHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'aadhaar');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const { transaction_id, json } = req.body;
  const result = await service.fetchEAadhaar({ transaction_id, json });
  await consumeVerificationQuota(order);
  res.json(result);
});
