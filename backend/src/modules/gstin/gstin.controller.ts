import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { GstinService } from './gstin.service';
import { GstinFetchRequest, GstinByPanRequest } from '../../common/validation/schemas';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new GstinService();

class GstinController extends BaseController {
  // POST /api/gstin/fetch-by-pan
  // Uses gstin quota with pan as fallback
  // POST /api/gstin/fetch-by-pan
  // Uses gstin quota with pan as fallback
  fetchGstinByPanHandler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, GstinByPanRequest>, res: Response) => {
    // Validation handled by Zod
    await this.handleVerificationWithFallback(req, res, 'gstin', ['pan'], async () => {
      return service.fetchByPan(req.body);
    });
  });

  // POST /api/gstin/fetch-lite
  // Expects body: { gstin: string, consent: string }
  // POST /api/gstin/fetch-lite
  // Expects body: { gstin: string, consent: string }
  fetchGstinLiteHandler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, GstinFetchRequest>, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'gstin',
        requireConsent: false, // Handled by Zod
        requiredFields: [], // Handled by Zod
      },
      async () => {
        return service.fetchLite(req.body);
      },
    );
  });

  // POST /api/gstin/fetch-contact
  // Expects body: { gstin: string, consent: string }
  // POST /api/gstin/fetch-contact
  // Expects body: { gstin: string, consent: string }
  fetchGstinContactHandler = asyncHandler(async (req: AuthenticatedRequest<{}, {}, GstinFetchRequest>, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'gstin',
        requireConsent: false,
        requiredFields: [],
      },
      async () => {
        return service.fetchContact(req.body);
      },
    );
  });
}

// Create controller instance and export handlers
const controller = new GstinController();

export const fetchGstinByPanHandler = controller.fetchGstinByPanHandler.bind(controller);
export const fetchGstinLiteHandler = controller.fetchGstinLiteHandler.bind(controller);
export const fetchGstinContactHandler = controller.fetchGstinContactHandler.bind(controller);
