import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { GstinService } from './gstin.service';

const service = new GstinService();

// POST /api/gstin/fetch-by-pan
export const fetchGstinByPanHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchByPan(req.body);
  res.json(result);
});

// POST /api/gstin/fetch-lite
// Expects body: { gstin: string, consent: string }
export const fetchGstinLiteHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchLite(req.body);
  res.json(result);
});

// POST /api/gstin/fetch-contact
// Expects body: { gstin: string, consent: string }
export const fetchGstinContactHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchContact(req.body);
  res.json(result);
});
