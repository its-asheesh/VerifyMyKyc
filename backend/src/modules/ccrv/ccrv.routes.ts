// ccrv.routes.ts

import { Router } from 'express';
import {
  generateCCRVReportHandler,
  fetchCCRVResultHandler,
  searchCCRVHandler
} from './ccrv.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();

/**
 * CCRV (Criminal Case Record Verification) APIs
 */

// Generate CCRV report
// POST /api/ccrv/generate-report
router.post('/generate-report', authenticate, requireUser, generateCCRVReportHandler);

// Fetch CCRV result
// POST /api/ccrv/fetch-result
router.post('/fetch-result', authenticate, requireUser, fetchCCRVResultHandler);

// Search CCRV records
// POST /api/ccrv/search
router.post('/search', authenticate, requireUser, searchCCRVHandler);

export default router;