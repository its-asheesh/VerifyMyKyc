import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { DrivingLicenseService } from './drivinglicense.service';

const service = new DrivingLicenseService();

// POST /api/drivinglicense/ocr
export const drivingLicenseOcrHandler = asyncHandler(async (req: Request, res: Response) => {
  const { consent } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const file_front = files?.file_front?.[0];
  const file_back = files?.file_back?.[0];
  if (!file_front) throw new Error('file_front is required');
  const result = await service.ocr(
    file_front.buffer,
    file_front.originalname,
    consent,
    file_back?.buffer,
    file_back?.originalname
  );
  res.json(result);
});

// POST /api/drivinglicense/fetch-details
export const fetchDrivingLicenseDetailsHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchDetails(req.body);
  res.json(result);
}); 