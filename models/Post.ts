import mongoose, { Schema, model, models } from 'mongoose';

export interface IPost {
  _id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  feature_image_url?: string;
  status: 'draft' | 'published';
  is_ai_generated: boolean;
  seoKeywords?: string;
  author_name?: string;
  author_image?: string;
  published_at: Date;
  created_at?: Date;
  updated_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}


const PostSchema = new Schema<IPost>({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  feature_image_url: { type: String },
  seoKeywords: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  is_ai_generated: { type: Boolean, default: false },
  author_name: { type: String },
  author_image: { type: String },
  published_at: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Create index for search and filtering
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ user_id: 1 });

const Post = models.Post || model('Post', PostSchema);

export default Post;
