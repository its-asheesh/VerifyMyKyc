import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { McaService } from './mca.service';

const service = new McaService();

// POST /api/mca/fetch-din-by-pan
export const fetchDinByPanHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchDinByPan(req.body);
  res.json(result);
});

// POST /api/mca/cin-by-pan
export const fetchCinByPanHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.fetchCinByPan(req.body);
  res.json(result);
});
