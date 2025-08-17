"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsByDateRange = exports.getAnalyticsOverview = exports.getRecentActivity = void 0;
const order_model_1 = require("../orders/order.model");
const auth_model_1 = require("../auth/auth.model");
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
// Get recent activity for admin dashboard
exports.getRecentActivity = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(req.query.limit) || 10;
    // Get recent orders
    const recentOrders = yield order_model_1.Order.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email company')
        .lean();
    // Get recent user registrations
    const recentUsers = yield auth_model_1.User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name email company createdAt')
        .lean();
    // Combine and format activities
    const activities = [];
    // Add order activities
    recentOrders.forEach((order) => {
        var _a, _b, _c;
        activities.push({
            id: order._id,
            type: 'order',
            message: `New ${order.orderType} order: ${order.serviceName}`,
            time: order.createdAt,
            user: ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.email) || 'Unknown User',
            userName: ((_b = order.userId) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown User',
            company: ((_c = order.userId) === null || _c === void 0 ? void 0 : _c.company) || '',
            amount: order.finalAmount,
            status: order.paymentStatus,
            orderId: order.orderId
        });
    });
    // Add user registration activities
    recentUsers.forEach((user) => {
        activities.push({
            id: user._id,
            type: 'user',
            message: 'New user registered',
            time: user.createdAt,
            user: user.email,
            userName: user.name,
            company: user.company || ''
        });
    });
    // Sort by time (most recent first) and limit
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const recentActivity = activities.slice(0, limit);
    // Format time for display
    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
        if (diffInSeconds < 60)
            return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    };
    const formattedActivity = recentActivity.map(activity => (Object.assign(Object.assign({}, activity), { timeAgo: formatTimeAgo(activity.time) })));
    res.json({
        success: true,
        data: formattedActivity
    });
}));
// Get overall analytics dashboard data
exports.getAnalyticsOverview = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Get current date and last month date
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    // Calculate metrics
    const [totalRevenue, lastMonthRevenue, totalOrders, lastMonthOrders, totalUsers, lastMonthUsers, activeOrders, completedOrders, pendingOrders, failedOrders] = yield Promise.all([
        // Total revenue
        order_model_1.Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]),
        // Last month revenue
        order_model_1.Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]),
        // Total orders
        order_model_1.Order.countDocuments(),
        // Last month orders
        order_model_1.Order.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
        }),
        // Total users
        auth_model_1.User.countDocuments(),
        // Last month users
        auth_model_1.User.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
        }),
        // Active orders
        order_model_1.Order.countDocuments({ status: 'active' }),
        // Completed orders
        order_model_1.Order.countDocuments({ paymentStatus: 'completed' }),
        // Pending orders
        order_model_1.Order.countDocuments({ paymentStatus: 'pending' }),
        // Failed orders
        order_model_1.Order.countDocuments({ paymentStatus: 'failed' })
    ]);
    // Calculate revenue trend (last 6 months) with order statistics
    const revenueTrend = yield order_model_1.Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1), // Last 6 months
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1) // End of current month
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$finalAmount', 0] } },
                totalOrders: { $sum: 1 },
                completedOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
                pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
                activeOrders: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                expiredOrders: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    // Debug: Check August orders specifically
    const augustOrders = yield order_model_1.Order.find({
        createdAt: {
            $gte: new Date(now.getFullYear(), 7, 1), // August 1st
            $lt: new Date(now.getFullYear(), 8, 1) // September 1st
        }
    }).select('orderId paymentStatus status createdAt finalAmount').lean();
    console.log('August Orders Debug:', {
        totalAugustOrders: augustOrders.length,
        augustOrders: augustOrders.map(o => ({
            orderId: o.orderId,
            paymentStatus: o.paymentStatus,
            status: o.status,
            finalAmount: o.finalAmount,
            date: o.createdAt
        }))
    });
    // Calculate service distribution
    const serviceDistribution = yield order_model_1.Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
            $group: {
                _id: '$serviceName',
                count: { $sum: 1 },
                revenue: { $sum: '$finalAmount' }
            }
        },
        { $sort: { count: -1 } }
    ]);
    // Calculate top performing plans
    const topPlans = yield order_model_1.Order.aggregate([
        { $match: { paymentStatus: 'completed', orderType: 'plan' } },
        {
            $group: {
                _id: {
                    planName: '$serviceDetails.planName',
                    planType: '$serviceDetails.planType'
                },
                revenue: { $sum: '$finalAmount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 }
    ]);
    // Calculate user growth metrics
    const userGrowth = yield auth_model_1.User.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                newUsers: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 6 }
    ]);
    // Calculate success rate
    const totalCompletedOrders = completedOrders;
    const totalFailedOrders = failedOrders;
    const successRate = totalCompletedOrders + totalFailedOrders > 0
        ? ((totalCompletedOrders / (totalCompletedOrders + totalFailedOrders)) * 100).toFixed(1)
        : '100.0';
    // Calculate percentage changes
    const revenueChange = ((_a = lastMonthRevenue[0]) === null || _a === void 0 ? void 0 : _a.total)
        ? (((((_b = totalRevenue[0]) === null || _b === void 0 ? void 0 : _b.total) || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1)
        : '0.0';
    const ordersChange = lastMonthOrders > 0
        ? (((totalOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
        : '0.0';
    const usersChange = lastMonthUsers > 0
        ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
        : '0.0';
    // Format revenue trend data with order statistics
    const formattedRevenueTrend = revenueTrend.map(item => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
        value: item.revenue,
        totalOrders: item.totalOrders,
        completedOrders: item.completedOrders,
        pendingOrders: item.pendingOrders,
        activeOrders: item.activeOrders,
        expiredOrders: item.expiredOrders
    }));
    // Format service distribution data
    const totalServiceOrders = serviceDistribution.reduce((sum, service) => sum + service.count, 0);
    const formattedServiceDistribution = serviceDistribution.map(service => ({
        service: service._id,
        count: service.count,
        percentage: totalServiceOrders > 0 ? Math.round((service.count / totalServiceOrders) * 100) : 0
    }));
    // Format top plans data
    const formattedTopPlans = topPlans.map(plan => ({
        name: `${plan._id.planName} ${plan._id.planType}`,
        revenue: plan.revenue,
        count: plan.count
    }));
    res.json({
        success: true,
        data: {
            metrics: {
                totalRevenue: ((_c = totalRevenue[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                totalOrders,
                totalUsers,
                activeOrders,
                successRate: parseFloat(successRate),
                revenueChange: parseFloat(revenueChange),
                ordersChange: parseFloat(ordersChange),
                usersChange: parseFloat(usersChange)
            },
            revenueTrend: formattedRevenueTrend,
            serviceDistribution: formattedServiceDistribution,
            topPlans: formattedTopPlans,
            userGrowth: userGrowth.map(item => ({
                month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
                newUsers: item.newUsers
            }))
        }
    });
}));
// Get detailed analytics by date range
exports.getAnalyticsByDateRange = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: 'Start date and end date are required'
        });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Calculate metrics for the date range
    const [totalRevenue, totalOrders, completedOrders, pendingOrders, activeOrders, expiredOrders, failedOrders] = yield Promise.all([
        // Total revenue
        order_model_1.Order.aggregate([
            {
                $match: {
                    paymentStatus: 'completed',
                    createdAt: { $gte: start, $lte: end }
                }
            },
            { $group: { _id: null, total: { $sum: '$finalAmount' } } }
        ]),
        // Total orders
        order_model_1.Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        // Completed orders
        order_model_1.Order.countDocuments({
            paymentStatus: 'completed',
            createdAt: { $gte: start, $lte: end }
        }),
        // Pending orders
        order_model_1.Order.countDocuments({
            paymentStatus: 'pending',
            createdAt: { $gte: start, $lte: end }
        }),
        // Active orders
        order_model_1.Order.countDocuments({
            status: 'active',
            createdAt: { $gte: start, $lte: end }
        }),
        // Expired orders
        order_model_1.Order.countDocuments({
            status: 'expired',
            createdAt: { $gte: start, $lte: end }
        }),
        // Failed orders
        order_model_1.Order.countDocuments({
            paymentStatus: 'failed',
            createdAt: { $gte: start, $lte: end }
        })
    ]);
    // Calculate revenue trend by month for the date range
    const revenueTrend = yield order_model_1.Order.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$finalAmount', 0] } },
                totalOrders: { $sum: 1 },
                completedOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
                pendingOrders: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
                activeOrders: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                expiredOrders: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
            }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    // Calculate service distribution for the date range
    const serviceDistribution = yield order_model_1.Order.aggregate([
        {
            $match: {
                paymentStatus: 'completed',
                createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
                _id: '$serviceName',
                count: { $sum: 1 },
                revenue: { $sum: '$finalAmount' }
            }
        },
        { $sort: { count: -1 } }
    ]);
    // Calculate success rate
    const successRate = completedOrders + failedOrders > 0
        ? ((completedOrders / (completedOrders + failedOrders)) * 100).toFixed(1)
        : '100.0';
    // Format revenue trend data
    const formattedRevenueTrend = revenueTrend.map(item => ({
        month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
        value: item.revenue,
        totalOrders: item.totalOrders,
        completedOrders: item.completedOrders,
        pendingOrders: item.pendingOrders,
        activeOrders: item.activeOrders,
        expiredOrders: item.expiredOrders
    }));
    // Format service distribution data
    const totalServiceOrders = serviceDistribution.reduce((sum, service) => sum + service.count, 0);
    const formattedServiceDistribution = serviceDistribution.map(service => ({
        service: service._id,
        count: service.count,
        percentage: totalServiceOrders > 0 ? Math.round((service.count / totalServiceOrders) * 100) : 0
    }));
    res.json({
        success: true,
        data: {
            dateRange: {
                startDate: start.toISOString(),
                endDate: end.toISOString()
            },
            metrics: {
                totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                totalOrders,
                completedOrders,
                pendingOrders,
                activeOrders,
                expiredOrders,
                failedOrders,
                successRate: parseFloat(successRate)
            },
            revenueTrend: formattedRevenueTrend,
            serviceDistribution: formattedServiceDistribution
        }
    });
}));
