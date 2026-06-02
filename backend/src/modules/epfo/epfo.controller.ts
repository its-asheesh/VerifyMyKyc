import { Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { EpfoService } from './epfo.service';
import { BaseController } from '../../common/controllers/BaseController';

const service = new EpfoService();

class EpfoController extends BaseController {
  // POST /api/epfo/fetch-uan
  fetchUanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.fetchUan(req.body);
      },
    );
  });

  // POST /api/epfo/passbook/generate-otp
  generateOtpHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.generateOtp(req.body);
      },
    );
  });

  // POST /api/epfo/passbook/validate-otp
  validateOtpHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.validateOtp(req.headers['x-transaction-id'] as string, req.body);
      },
    );
  });

  // GET /api/epfo/passbook/employers
  listEmployersHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.listEmployers(req.headers['x-transaction-id'] as string);
      },
    );
  });

  // POST /api/epfo/passbook/fetch
  fetchPassbookHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.fetchPassbook(req.headers['x-transaction-id'] as string, req.body);
      },
    );
  });

  // POST /api/epfo/employment-history/fetch-by-uan
  employmentByUanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.fetchEmploymentByUan(req.body);
      },
    );
  });

  // POST /api/epfo/employment-history/fetch-latest
  employmentLatestHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.fetchLatestEmployment(req.body);
      },
    );
  });

  // POST /api/epfo/uan/fetch-by-pan
  uanByPanHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.fetchUanByPan(req.body);
      },
    );
  });

  // POST /api/epfo/employer-verify
  employerVerifyHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await this.handleVerificationRequest(
      req,
      res,
      {
        verificationType: 'epfo',
      },
      async () => {
        return service.verifyEmployer(req.body);
      },
    );
  });
}

// Create controller instance and export handlers
const controller = new EpfoController();

export const fetchUanHandler = controller.fetchUanHandler.bind(controller);
export const generateOtpHandler = controller.generateOtpHandler.bind(controller);
export const validateOtpHandler = controller.validateOtpHandler.bind(controller);
export const listEmployersHandler = controller.listEmployersHandler.bind(controller);
export const fetchPassbookHandler = controller.fetchPassbookHandler.bind(controller);
export const employmentByUanHandler = controller.employmentByUanHandler.bind(controller);
export const employmentLatestHandler = controller.employmentLatestHandler.bind(controller);
export const uanByPanHandler = controller.uanByPanHandler.bind(controller);
export const employerVerifyHandler = controller.employerVerifyHandler.bind(controller);
