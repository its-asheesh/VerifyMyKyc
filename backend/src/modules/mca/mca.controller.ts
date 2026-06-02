import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { McaService } from './mca.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new McaService();

class McaController extends BaseController {
  // POST /api/mca/fetch-din-by-pan
  fetchDinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // Prefer 'company' quota; fallback to 'pan'
    await this.handleVerificationWithFallback(req, res, 'company', ['pan'], async () => {
      return service.fetchDinByPan(req.body);
    });
  });

  // POST /api/mca/cin-by-pan
  fetchCinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // Prefer 'company' quota; fallback to 'pan'
    await this.handleVerificationWithFallback(req, res, 'company', ['pan'], async () => {
      return service.fetchCinByPan(req.body);
    });
  });

  // POST /api/mca/fetch-company
  fetchCompanyHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    // Prefer 'company' quota; fallback to 'pan'
    await this.handleVerificationWithFallback(req, res, 'company', ['pan'], async () => {
      return service.fetchCompany(req.body);
    });
  });
}

// Create controller instance and export handlers
const controller = new McaController();

export const fetchDinByPanHandler = controller.fetchDinByPanHandler.bind(controller);
export const fetchCinByPanHandler = controller.fetchCinByPanHandler.bind(controller);
export const fetchCompanyHandler = controller.fetchCompanyHandler.bind(controller);
