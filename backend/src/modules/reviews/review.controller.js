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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicReviews = exports.adminDeleteReview = exports.adminUpdateReview = exports.adminListReviews = exports.createReview = exports.getProductReviews = void 0;
const review_model_1 = require("./review.model");
// Public: list approved reviews for a product with basic stats
const getProductReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { productId } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const [items, total, ratingAgg] = yield Promise.all([
            review_model_1.Review.find({ productId, status: 'approved' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name email')
                .lean(),
            review_model_1.Review.countDocuments({ productId, status: 'approved' }),
            review_model_1.Review.aggregate([
                { $match: { productId, status: 'approved' } },
                { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]),
        ]);
        const avgRating = ((_a = ratingAgg[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0;
        const count = ((_b = ratingAgg[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
        return res.json({
            items,
            pagination: { page, limit, total },
            stats: { avgRating, count },
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to fetch reviews' });
    }
});
exports.getProductReviews = getProductReviews;
// Auth: create a review for a product
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: 'Unauthorized' });
        const { productId, rating, title, comment } = req.body;
        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: 'productId, rating and comment are required' });
        }
        // Optional: prevent duplicate reviews by same user for same product
        const existing = yield review_model_1.Review.findOne({ userId: user._id, productId });
        if (existing) {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }
        const review = yield review_model_1.Review.create({
            userId: user._id,
            productId,
            rating,
            title,
            comment,
            status: 'approved',
        });
        return res.status(201).json(review);
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to create review' });
    }
});
exports.createReview = createReview;
// Admin: list all reviews (optional filters)
const adminListReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, productId, userId } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const filter = {};
        if (status)
            filter.status = status;
        if (productId)
            filter.productId = productId;
        if (userId)
            filter.userId = userId;
        const [items, total] = yield Promise.all([
            review_model_1.Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email').lean(),
            review_model_1.Review.countDocuments(filter),
        ]);
        return res.json({ items, pagination: { page, limit, total } });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to fetch reviews' });
    }
});
exports.adminListReviews = adminListReviews;
// Admin: update review (rating/comment/status/title)
const adminUpdateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { rating, title, comment, status } = req.body;
        const update = {};
        if (typeof rating !== 'undefined')
            update.rating = rating;
        if (typeof title !== 'undefined')
            update.title = title;
        if (typeof comment !== 'undefined')
            update.comment = comment;
        if (typeof status !== 'undefined')
            update.status = status;
        const doc = yield review_model_1.Review.findByIdAndUpdate(id, update, { new: true });
        if (!doc)
            return res.status(404).json({ message: 'Review not found' });
        return res.json(doc);
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to update review' });
    }
});
exports.adminUpdateReview = adminUpdateReview;
// Admin: delete review
const adminDeleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const doc = yield review_model_1.Review.findByIdAndDelete(id);
        if (!doc)
            return res.status(404).json({ message: 'Review not found' });
        return res.json({ success: true });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to delete review' });
    }
});
exports.adminDeleteReview = adminDeleteReview;
// Public: list approved reviews across all products (all categories)
const getPublicReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const [items, total, ratingAgg] = yield Promise.all([
            review_model_1.Review.find({ status: 'approved' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name email')
                .lean(),
            review_model_1.Review.countDocuments({ status: 'approved' }),
            review_model_1.Review.aggregate([
                { $match: { status: 'approved' } },
                { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
            ]),
        ]);
        const avgRating = ((_a = ratingAgg[0]) === null || _a === void 0 ? void 0 : _a.avgRating) || 0;
        const count = ((_b = ratingAgg[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
        return res.json({ items, pagination: { page, limit, total }, stats: { avgRating, count } });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Failed to fetch reviews' });
    }
});
exports.getPublicReviews = getPublicReviews;
