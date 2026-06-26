import { Router } from 'express';
import { getSettings, updateSettings } from './system.controller';
import { authenticate, requireAdmin } from '../../common/middleware/auth';

const router = Router();

// GET /api/system/settings - Public
router.get('/settings', getSettings);

// PUT /api/system/settings - Admin only
router.put('/settings', authenticate, requireAdmin, updateSettings);

export default router;
