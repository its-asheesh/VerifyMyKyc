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
exports.adminTogglePostStatus = exports.adminDeletePost = exports.adminUpdatePost = exports.adminCreatePost = exports.adminGetPostById = exports.adminListPosts = exports.getPublicPostBySlug = exports.getPublicPosts = void 0;
const asyncHandler_1 = __importDefault(require("../../common/middleware/asyncHandler"));
const blog_model_1 = require("./blog.model");
function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
function ensureUniqueSlug(base, currentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let slug = slugify(base);
        let counter = 0;
        // Keep trying with suffix -1, -2, ... until unique
        // Skip the same document when updating
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const candidate = counter === 0 ? slug : `${slug}-${counter}`;
            const existing = yield blog_model_1.BlogPost.findOne({ slug: candidate });
            if (!existing || (currentId && existing._id.toString() === currentId)) {
                return candidate;
            }
            counter += 1;
        }
    });
}
// Public: list published blog posts with pagination, optional tag and search query
exports.getPublicPosts = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const tag = req.query.tag || '';
    const q = req.query.q || '';
    const filter = { status: 'published' };
    if (tag)
        filter.tags = tag;
    if (q)
        filter.title = { $regex: q, $options: 'i' };
    const [items, total] = yield Promise.all([
        blog_model_1.BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        blog_model_1.BlogPost.countDocuments(filter),
    ]);
    res.json({ items, pagination: { page, limit, total } });
}));
// Public: get a single published post by slug
exports.getPublicPostBySlug = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const post = yield blog_model_1.BlogPost.findOne({ slug, status: 'published' }).lean();
    if (!post)
        return res.status(404).json({ message: 'Post not found' });
    res.json(post);
}));
// Admin: list all posts with filters
exports.adminListPosts = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const { status, tag, q } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (tag)
        filter.tags = tag;
    if (q)
        filter.title = { $regex: q, $options: 'i' };
    const [items, total] = yield Promise.all([
        blog_model_1.BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        blog_model_1.BlogPost.countDocuments(filter),
    ]);
    res.json({ items, pagination: { page, limit, total } });
}));
// Admin: get post by id
exports.adminGetPostById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield blog_model_1.BlogPost.findById(id);
    if (!post)
        return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
}));
// Admin: create post
exports.adminCreatePost = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, slug, excerpt, content, coverImage, tags = [], status = 'draft', author } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const finalSlug = yield ensureUniqueSlug(slug && slug.trim().length ? slug : title);
    const post = yield blog_model_1.BlogPost.create({
        title,
        slug: finalSlug,
        excerpt,
        content,
        coverImage,
        tags,
        status,
        author,
    });
    res.status(201).json({ post });
}));
// Admin: update post
exports.adminUpdatePost = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const update = req.body;
    if (update.title && !update.slug) {
        // If title changed but slug not provided, keep slug same; otherwise can compute later if needed
    }
    if (typeof update.slug !== 'undefined' && update.slug) {
        update.slug = yield ensureUniqueSlug(update.slug, id);
    }
    const post = yield blog_model_1.BlogPost.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!post)
        return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
}));
// Admin: delete post
exports.adminDeletePost = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield blog_model_1.BlogPost.findByIdAndDelete(id);
    if (!post)
        return res.status(404).json({ message: 'Post not found' });
    res.json({ success: true });
}));
// Admin: toggle status
exports.adminTogglePostStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield blog_model_1.BlogPost.findById(id);
    if (!post)
        return res.status(404).json({ message: 'Post not found' });
    post.status = post.status === 'published' ? 'draft' : 'published';
    yield post.save();
    res.json({ post });
}));
