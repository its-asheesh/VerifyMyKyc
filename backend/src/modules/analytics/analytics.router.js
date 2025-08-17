"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const auth_1 = require("../../common/middleware/auth");
const router = (0, express_1.Router)();
// All analytics routes require admin authentication
router.use(auth_1.authenticate, auth_1.requireAdmin);
// Get analytics overview
router.get('/overview', analytics_controller_1.getAnalyticsOverview);
// Get analytics by date range
router.get('/date-range', analytics_controller_1.getAnalyticsByDateRange);
// Get recent activity
router.get('/recent-activity', analytics_controller_1.getRecentActivity);
exports.default = router;
