import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { EChallanService } from './echallan.service';

const service = new EChallanService();

// POST /api/echallan/fetch
export const fetchEChallanHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetch(req.body);
  res.json(result);
}); 