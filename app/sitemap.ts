import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();
  const posts = await Post.find({ status: 'published' }).select('slug published_at').lean();

  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post: any) => ({
    url: `https://ai-blog.vercel.app/blog/${post.slug}`,
    lastModified: new Date(post.published_at || post.created_at),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [
    {
      url: 'https://ai-blog.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: 'https://ai-blog.vercel.app/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...postEntries,
  ];
}
