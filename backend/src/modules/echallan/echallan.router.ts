import { Router } from 'express';
import { fetchEChallanHandler } from './echallan.controller';

const router = Router();

router.post('/fetch', fetchEChallanHandler);

export default router;
