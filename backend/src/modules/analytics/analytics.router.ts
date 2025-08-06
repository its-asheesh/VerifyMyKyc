import { Router } from 'express';
import { getAnalyticsOverview, getAnalyticsByDateRange, getRecentActivity } from './analytics.controller';
import { authenticate, requireAdmin } from '../../common/middleware/auth';

const router = Router();

// All analytics routes require admin authentication
router.use(authenticate, requireAdmin);

// Get analytics overview
router.get('/overview', getAnalyticsOverview);

// Get analytics by date range
router.get('/date-range', getAnalyticsByDateRange);

// Get recent activity
router.get('/recent-activity', getRecentActivity);

export default router; 