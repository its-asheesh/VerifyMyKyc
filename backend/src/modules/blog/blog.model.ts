import mongoose, { Document, Schema } from 'mongoose';

export type BlogStatus = 'draft' | 'published';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: BlogStatus;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 500 },
    content: { type: String, required: true },
    coverImage: { type: String, trim: true },
    tags: { type: [String], default: [], index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    author: { type: String, trim: true },
  },
  { timestamps: true },
);

blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ tags: 1, status: 1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogSchema);
