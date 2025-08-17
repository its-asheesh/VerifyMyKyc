import { Router } from 'express';
import { 
  fetchGstinByPanHandler, 
  fetchGstinLiteHandler, 
  fetchGstinContactHandler 
} from './gstin.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();

// Fetch GSTIN by PAN
router.post('/fetch-by-pan', authenticate, requireUser, fetchGstinByPanHandler);

// Fetch GSTIN Lite
router.post('/fetch-lite', authenticate, requireUser, fetchGstinLiteHandler);

// Fetch GSTIN Contact Details
router.post('/fetch-contact', authenticate, requireUser, fetchGstinContactHandler);

export default router;
