import { Router } from 'express';
import {
  fetchGstinByPanHandler,
  fetchGstinLiteHandler,
  fetchGstinContactHandler,
} from './gstin.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';
import { validate } from '../../common/validation/middleware';
import { gstinByPanSchema, gstinFetchSchema } from '../../common/validation/schemas';

const router = Router();

// Fetch GSTIN by PAN
router.post('/fetch-by-pan', authenticate, requireUser, validate(gstinByPanSchema), fetchGstinByPanHandler);

// Fetch GSTIN Lite
router.post('/fetch-lite', authenticate, requireUser, validate(gstinFetchSchema), fetchGstinLiteHandler);

// Fetch GSTIN Contact Details
router.post('/fetch-contact', authenticate, requireUser, validate(gstinFetchSchema), fetchGstinContactHandler);

export default router;
