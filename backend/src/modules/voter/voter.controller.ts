import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { VoterService } from './voter.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new VoterService();

// POST /api/voter/boson/fetch
export const voterBosonFetchHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'voterid');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.bosonFetch(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// GET /api/voter/meson/init
export const voterMesonInitHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await service.mesonInit();
  res.json(result);
});

// POST /api/voter/meson/fetch
export const voterMesonFetchHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'voterid');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.mesonFetch(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
});

// POST /api/voter/ocr (multipart)
export const voterOcrHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { consent } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const file_front = files?.file_front?.[0];
  const file_back = files?.file_back?.[0];
  if (!file_front) throw new Error('file_front is required');

  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'voterid');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });

  const result = await service.ocr(
    file_front.buffer,
    file_front.originalname,
    consent,
    file_back?.buffer,
    file_back?.originalname
  );
  await consumeVerificationQuota(order);
  res.json(result);
});
