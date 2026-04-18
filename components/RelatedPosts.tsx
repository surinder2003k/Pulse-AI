import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface RelatedPostsProps {
  currentSlug: string;
  category: string;
}

export default async function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
  await connectDB();
  const postsRaw = await Post.find({
    category,
    status: "published",
    slug: { $ne: currentSlug }
  })
  .limit(3)
  .lean();

  if (!postsRaw || postsRaw.length === 0) return null;
  const posts = JSON.parse(JSON.stringify(postsRaw));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post: any) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
              <Image
                src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-2 px-1">
              <p className="text-xs text-primary font-bold uppercase tracking-wider">{formatDate(post.created_at)}</p>
              <h4 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
