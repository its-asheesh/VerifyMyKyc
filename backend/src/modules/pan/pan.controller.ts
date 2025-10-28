import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { PanService } from './pan.service';
import { DigilockerFetchDocumentRequest } from './providers/digilockerFetchDocument.provider';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new PanService();

class PanController extends BaseController {
  // POST /api/pan/father-name
  fetchFatherNameHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { pan_number, consent } = req.body || {};

    this.logRequest('PAN Father-Name', req.user._id.toString(), { pan_number });

    await this.handleVerificationRequest(req, res, {
      verificationType: 'pan',
      requireConsent: true,
      requiredFields: ['pan_number']
    }, async () => {
      return service.fetchFatherName({ pan_number, consent });
    });
  });

  // POST /api/pan/gstin-by-pan
  fetchGstinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { pan_number, consent } = req.body || {};

    this.logRequest('PAN GSTIN-by-PAN', req.user._id.toString(), { pan_number });

    await this.handleVerificationRequest(req, res, {
      verificationType: 'pan',
      requireConsent: true,
      requiredFields: ['pan_number']
    }, async () => {
      return service.fetchGstinByPan({ pan_number, consent });
    });
  });

  // POST /api/pan/din-by-pan
  fetchDinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { pan_number, consent } = req.body || {};

    this.logRequest('PAN DIN-by-PAN', req.user._id.toString(), { pan_number });

    // Uses fallback quota handling (company -> pan)
    await this.handleVerificationWithFallback(req, res, 'company', ['pan'], async () => {
      return service.fetchDinByPan({ pan_number, consent });
    });
  });

  // POST /api/pan/cin-by-pan
  fetchCinByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const pan_number = req.body?.pan_number || req.body?.pan;
    const consent = req.body?.consent;

    this.logRequest('PAN CIN-by-PAN', req.user._id.toString(), { pan_number });

    // Uses fallback quota handling (company -> pan)
    await this.handleVerificationWithFallback(req, res, 'company', ['pan'], async () => {
      return service.fetchCinByPan({ pan_number, consent });
    });
  });

  // POST /api/pan/aadhaar-link
  checkPanAadhaarLinkHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    this.logRequest('PAN Aadhaar-Link', req.user._id.toString());

    await this.handleVerificationRequest(req, res, {
      verificationType: 'pan',
      requireConsent: true,
      requiredFields: ['pan_number', 'aadhaar_number']
    }, async () => {
      return service.checkPanAadhaarLink(req.body);
    });
  });

  // POST /api/pan/digilocker-fetch-document
  digilockerFetchDocumentHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(req, res, {
      verificationType: 'pan',
      requiredFields: ['document_uri', 'transaction_id']
    }, async () => {
      return service.digilockerFetchDocument(req.body as DigilockerFetchDocumentRequest);
    });
  });

  // POST /api/pan/fetch-advanced
  fetchPanAdvanceHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(req, res, {
      verificationType: 'pan',
      requireConsent: true,
      requiredFields: ['pan_number']
    }, async () => {
      return service.fetchPanAdvance(req.body);
    });
  });

  // POST /api/pan/fetch-detailed
  fetchPanDetailedHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(req, res, {
      verificationType: 'pan',
      requireConsent: true,
      requiredFields: ['pan_number']
    }, async () => {
      return service.fetchPanDetailed(req.body);
    });
  });
}

// Create controller instance
const controller = new PanController();

// Export handlers
export const fetchFatherNameHandler = controller.fetchFatherNameHandler.bind(controller);
export const fetchGstinByPanHandler = controller.fetchGstinByPanHandler.bind(controller);
export const fetchDinByPanHandler = controller.fetchDinByPanHandler.bind(controller);
export const fetchCinByPanHandler = controller.fetchCinByPanHandler.bind(controller);
export const checkPanAadhaarLinkHandler = controller.checkPanAadhaarLinkHandler.bind(controller);
export const digilockerFetchDocumentHandler = controller.digilockerFetchDocumentHandler.bind(controller);
export const fetchPanAdvanceHandler = controller.fetchPanAdvanceHandler.bind(controller);
export const fetchPanDetailedHandler = controller.fetchPanDetailedHandler.bind(controller);

// Handlers without quota (digilocker-init and digilocker-pull)
// POST /api/pan/digilocker-init
export const digilockerInitHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await service.digilockerInit(req.body);
  res.json(result);
});

// POST /api/pan/digilocker-pull
export const digilockerPullHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { transactionId, ...payload } = req.body;
  const result = await service.digilockerPull(payload, transactionId);
  res.json(result);
});