import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { DrivingLicenseService } from './drivinglicense.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { ensureVerificationQuota, consumeVerificationQuota } from '../orders/quota.service';

const service = new DrivingLicenseService();

// POST /api/drivinglicense/ocr
export const drivingLicenseOcrHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { consent } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const file_front = files?.file_front?.[0];
  const file_back = files?.file_back?.[0];
  if (!file_front) throw new Error('file_front is required');
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'drivinglicense');
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

// POST /api/drivinglicense/fetch-details
export const fetchDrivingLicenseDetailsHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const order = await ensureVerificationQuota(userId, 'drivinglicense');
  if (!order) return res.status(403).json({ message: 'Verification quota exhausted or expired' });
  const result = await service.fetchDetails(req.body);
  await consumeVerificationQuota(order);
  res.json(result);
}); 