import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { CCRVService } from './ccrv.service';
import { AuthenticatedRequest } from '../../common/middleware/auth';
import { BaseController } from '../../common/controllers/BaseController';

const service = new CCRVService();

class CCRVController extends BaseController {
  // POST /api/ccrv/generate-report
  generateCCRVReportHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      name,
      address,
      father_name,
      additional_address,
      date_of_birth,
      consent
    } = req.body || {};

    this.logRequest('CCRV Generate Report', req.user._id.toString(), { name, address });

    await this.handleVerificationRequest(req, res, {
      verificationType: 'ccrv',
      requireConsent: true,
      requiredFields: ['name', 'address']
    }, async () => {
      return service.generateReport({
        name,
        address,
        father_name,
        additional_address,
        date_of_birth,
        consent: consent === true ? 'Y' : consent === false ? 'N' : consent
      });
    });
  });

  // POST /api/ccrv/search
  searchCCRVHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      name,
      address,
      father_name,
      date_of_birth,
      case_category,
      type,
      name_match_type,
      father_match_type,
      jurisdiction_type,
      consent
    } = req.body || {};

    this.logRequest('CCRV Search', req.user._id.toString(), { name, address });

    await this.handleVerificationRequest(req, res, {
      verificationType: 'ccrv',
      requireConsent: true,
      requiredFields: ['name', 'address']
    }, async () => {
      const searchPayload = {
        name,
        address,
        father_name,
        date_of_birth,
        case_category,
        type,
        name_match_type,
        father_match_type,
        jurisdiction_type,
        consent: consent === true ? 'Y' : consent === false ? 'N' : consent
      };
      
      console.log('CCRV Search Payload being sent to API:', searchPayload);
      
      return service.search(searchPayload);
    });
  });
}

// Create controller instance
const controller = new CCRVController();

// Export handlers
export const generateCCRVReportHandler = controller.generateCCRVReportHandler.bind(controller);
export const searchCCRVHandler = controller.searchCCRVHandler.bind(controller);

// POST /api/ccrv/fetch-result - No quota required (polling endpoint)
export const fetchCCRVResultHandler = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { transaction_id } = req.body || {};

  if (!transaction_id) {
    return res.status(400).json({ message: 'transaction_id is required' });
  }

  console.log('CCRV Fetch Result Controller: incoming request', {
    userId,
    transaction_id,
  });

  try {
    const result = await service.fetchResult({ transaction_id });

    console.log('CCRV Fetch Result Controller: fetched result without consuming quota (polling)');
    console.log('CCRV Fetch Result Data:', JSON.stringify(result, null, 2));

    res.json(result);
  } catch (error: any) {
    console.error('CCRV Fetch Result Error:', error);
    res.status(500).json({
      message: 'Failed to fetch CCRV result',
      error: error.message
    });
  }
});

/**
 * PUBLIC: Callback handler for OnGrid CCRV API
 * This is where OnGrid sends the result when the report is ready
 */
export const ccrvCallbackHandler = async (req: Request, res: Response) => {
  const transactionId = req.headers['x-transaction-id'] as string;
  const referenceId = req.headers['x-reference-id'] as string;
  const authType = req.headers['x-auth-type'] as string;

  const payload = req.body;

  console.log('✅ CCRV Callback Received', {
    transactionId,
    referenceId,
    authType,
    payload,
  });

  try {
    await service.handleCallback({
      transactionId,
      referenceId,
      payload,
    });

    return res.status(200).json({ received: true, transactionId });
  } catch (error: any) {
    console.error('CCRV Callback Processing Error:', error);
    return res.status(500).json({ error: 'Failed to process callback' });
  }
};
