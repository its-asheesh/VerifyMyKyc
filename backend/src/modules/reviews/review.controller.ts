import { Request, Response } from 'express';
import { Review } from './review.model';

// Public: list approved reviews for a product with basic stats
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [items, total, ratingAgg] = await Promise.all([
      Review.find({ productId, status: 'approved' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      Review.countDocuments({ productId, status: 'approved' }),
      Review.aggregate([
        { $match: { productId, status: 'approved' } },
        { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
    ]);

    const avgRating = ratingAgg[0]?.avgRating || 0;
    const count = ratingAgg[0]?.count || 0;

    return res.json({
      items,
      pagination: { page, limit, total },
      stats: { avgRating, count },
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch reviews' });
  }
};

// Auth: create a review for a product
export const createReview = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const { productId, rating, title, comment, verified } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'productId, rating and comment are required' });
    }

    // Optional: prevent duplicate reviews by same user for same product
    const existing = await Review.findOne({ userId: user._id, productId });
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      userId: user._id,
      productId,
      rating,
      title,
      comment,
      status: 'approved',
      verified: verified === true, // Only set to true if explicitly provided
    });

    return res.status(201).json(review);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to create review' });
  }
};

// Admin: list all reviews (optional filters)
export const adminListReviews = async (req: Request, res: Response) => {
  try {
    const { status, productId, userId, verified } = req.query as Record<string, string>;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    if (userId) filter.userId = userId;
    if (typeof verified !== 'undefined') filter.verified = verified === 'true' || verified === '1';

    const [items, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      Review.countDocuments(filter),
    ]);

    return res.json({ items, pagination: { page, limit, total } });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch reviews' });
  }
};

// Admin: update review (rating/comment/status/title)
export const adminUpdateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, status, verified } = req.body;
    const update: any = {};
    if (typeof rating !== 'undefined') update.rating = rating;
    if (typeof title !== 'undefined') update.title = title;
    if (typeof comment !== 'undefined') update.comment = comment;
    if (typeof status !== 'undefined') update.status = status;
    if (typeof verified !== 'undefined') {
      update.verified =
        typeof verified === 'string' ? verified === 'true' || verified === '1' : !!verified;
    }

    const doc = await Review.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Review not found' });
    return res.json(doc);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to update review' });
  }
};

// Admin: delete review
export const adminDeleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await Review.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Review not found' });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to delete review' });
  }
};

// Admin: set verified status (defaults to true if not provided)
export const adminSetVerified = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { verified } = req.body as any;
    if (typeof verified === 'undefined') verified = true;
    if (typeof verified === 'string') verified = verified === 'true' || verified === '1';

    const doc = await Review.findByIdAndUpdate(id, { verified }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Review not found' });
    return res.json(doc);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to set verified status' });
  }
};

// Public: list approved reviews across all products (all categories)
export const getPublicReviews = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [items, total, ratingAgg] = await Promise.all([
      Review.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      Review.countDocuments({ status: 'approved' }),
      Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]),
    ]);

    const avgRating = ratingAgg[0]?.avgRating || 0;
    const count = ratingAgg[0]?.count || 0;

    return res.json({ items, pagination: { page, limit, total }, stats: { avgRating, count } });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to fetch reviews' });
  }
};
