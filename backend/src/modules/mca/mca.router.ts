import { Router } from 'express';
import { fetchDinByPanHandler, fetchCinByPanHandler } from './mca.controller';

const router = Router();

// Fetch DIN by PAN
router.post('/din-by-pan', fetchDinByPanHandler);

// Fetch CIN by PAN
router.post('/cin-by-pan', fetchCinByPanHandler);

export default router;
