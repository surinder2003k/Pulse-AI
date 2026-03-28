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
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h3 className="text-3xl font-black italic">Related Stories</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post: any) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 bg-secondary/20">
              <Image
                src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">{formatDate(post.created_at)}</p>
              <h4 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight italic">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
