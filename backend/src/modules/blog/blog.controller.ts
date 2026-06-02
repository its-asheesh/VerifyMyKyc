import { Request, Response } from 'express';
import asyncHandler from '../../common/middleware/asyncHandler';
import { BlogPost, IBlogPost, BlogStatus } from './blog.model';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(base: string, currentId?: string) {
  const slug = slugify(base);
  let counter = 0;
  // Keep trying with suffix -1, -2, ... until unique
  // Skip the same document when updating

  while (true) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await BlogPost.findOne({ slug: candidate });
    if (!existing || (currentId && existing._id.toString() === currentId)) {
      return candidate;
    }
    counter += 1;
  }
}

// Public: list published blog posts with pagination, optional tag and search query
export const getPublicPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;
  const tag = (req.query.tag as string) || '';
  const q = (req.query.q as string) || '';

  const filter: any = { status: 'published' as BlogStatus };
  if (tag) filter.tags = tag;
  if (q) filter.title = { $regex: q, $options: 'i' };

  const [items, total] = await Promise.all([
    BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total } });
});

// Public: get a single published post by slug
export const getPublicPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = await BlogPost.findOne({ slug, status: 'published' }).lean();
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// Admin: list all posts with filters
export const adminListPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const { status, tag, q } = req.query as Record<string, string>;

  const filter: any = {};
  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (q) filter.title = { $regex: q, $options: 'i' };

  const [items, total] = await Promise.all([
    BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    BlogPost.countDocuments(filter),
  ]);

  res.json({ items, pagination: { page, limit, total } });
});

// Admin: get post by id
export const adminGetPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await BlogPost.findById(id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ post });
});

// Admin: create post
export const adminCreatePost = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    slug,
    excerpt,
    content,
    coverImage,
    tags = [],
    status = 'draft',
    author,
  } = req.body as Partial<IBlogPost>;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const finalSlug = await ensureUniqueSlug(slug && slug.trim().length ? slug : title);

  const post = await BlogPost.create({
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
});

// Admin: update post
export const adminUpdatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const update = req.body as Partial<IBlogPost>;

  if (update.title && !update.slug) {
    // If title changed but slug not provided, keep slug same; otherwise can compute later if needed
  }

  if (typeof update.slug !== 'undefined' && update.slug) {
    update.slug = await ensureUniqueSlug(update.slug, id);
  }

  const post = await BlogPost.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ post });
});

// Admin: delete post
export const adminDeletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ success: true });
});

// Admin: toggle status
export const adminTogglePostStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await BlogPost.findById(id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.status = post.status === 'published' ? 'draft' : 'published';
  await post.save();
  res.json({ post });
});
