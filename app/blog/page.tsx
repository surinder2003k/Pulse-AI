import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import Search from "@/components/Search";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import { PostGridSkeleton } from "@/components/LoadingSkeleton";

export const metadata = {
  title: "Blog Archive | Pulse AI",
  description: "Browse our collection of passionately written AI blog posts across various categories.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const category = params.category || "";
  const page = Number(params.page) || 1;
  const pageSize = 9;

  await connectDB();
  
  const filter: any = { status: "published" };
  
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ];
  }

  if (category && category !== "All") {
    filter.category = category;
  }

  const postsRaw = await Post.find(filter)
    .sort({ published_at: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  const count = await Post.countDocuments(filter);
  const posts = JSON.parse(JSON.stringify(postsRaw));
  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="flex flex-col gap-16 pb-20 pt-10 px-6">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic">
          The Passionate <span className="text-primary">Archive.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg md:text-xl">
          Explore {count || 0} articles crafted with deep insights and modern AI.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-y border-white/5 py-10">
        <CategoryFilter />
        <div className="w-full md:w-auto">
          <Search />
        </div>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {posts.map((post: any) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-secondary/10">
          <h3 className="text-2xl font-black mb-2 italic">Nothing found.</h3>
          <p className="text-muted-foreground">The AI is still thinking about this one.</p>
        </div>
      )}

      <div className="flex justify-center pt-10">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
