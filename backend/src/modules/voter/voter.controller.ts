import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { VoterService } from './voter.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new VoterService();

class VoterController extends BaseController {
  // POST /api/voter/boson/fetch
  voterBosonFetchHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(req, res, {
      verificationType: 'voterid'
    }, async () => {
      return service.bosonFetch(req.body);
    });
  });

  // POST /api/voter/meson/fetch
  voterMesonFetchHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(req, res, {
      verificationType: 'voterid'
    }, async () => {
      return service.mesonFetch(req.body);
    });
  });

  // POST /api/voter/ocr (multipart)
  voterOcrHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleFileUploadRequest(req, res, {
      verificationType: 'voterid',
      requireConsent: true
    }, async (files) => {
      const { consent } = req.body;
      return service.ocr(
        files.file_front.buffer,
        files.file_front.originalname,
        consent,
        files.file_back?.buffer,
        files.file_back?.originalname
      );
    });
  });
}

// Create controller instance
const controller = new VoterController();

// Export handlers
export const voterBosonFetchHandler = controller.voterBosonFetchHandler.bind(controller);
export const voterMesonFetchHandler = controller.voterMesonFetchHandler.bind(controller);
export const voterOcrHandler = controller.voterOcrHandler.bind(controller);

// GET /api/voter/meson/init - No quota required
export const voterMesonInitHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await service.mesonInit();
  res.json(result);
});
