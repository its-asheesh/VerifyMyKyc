import { Router } from 'express';
import { 
  fetchGstinByPanHandler, 
  fetchGstinLiteHandler, 
  fetchGstinContactHandler 
} from './gstin.controller';

const router = Router();

// Fetch GSTIN by PAN
router.post('/fetch-by-pan', fetchGstinByPanHandler);

// Fetch GSTIN Lite
router.post('/fetch-lite', fetchGstinLiteHandler);

// Fetch GSTIN Contact Details
router.post('/fetch-contact', fetchGstinContactHandler);

export default router;
