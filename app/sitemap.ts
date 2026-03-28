import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-blog.vercel.app';
  
  try {
    await connectDB();
    const posts = await Post.find({ status: 'published' }).select('slug published_at created_at').lean();

    const postEntries: MetadataRoute.Sitemap = (posts || []).map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || post.created_at || new Date()),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...postEntries,
    ];
  } catch (error) {
    console.error("Sitemap generation database error:", error);
    // Return basic pages if DB fails during build to prevent build crash
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
    ];
  }
}
