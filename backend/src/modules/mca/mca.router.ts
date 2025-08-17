import { Router } from 'express';
import { fetchDinByPanHandler, fetchCinByPanHandler, fetchCompanyHandler } from './mca.controller';
import { authenticate, requireUser } from '../../common/middleware/auth';

const router = Router();

// Fetch DIN by PAN
router.post('/din-by-pan', authenticate, requireUser, fetchDinByPanHandler);

// Fetch CIN by PAN
router.post('/cin-by-pan', authenticate, requireUser, fetchCinByPanHandler);

// Fetch Company (by CIN/FCRN/LLPIN)
router.post('/fetch-company', authenticate, requireUser, fetchCompanyHandler);

export default router;
