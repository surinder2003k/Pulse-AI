import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import Search from "@/components/Search";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import { PostGridSkeleton } from "@/components/LoadingSkeleton";
import { Database, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;
  const baseUrl = "https://pulse-blog-ai.vercel.app";
  
  let title = "Archive | Pulse AI";
  let description = "Browse our collection of high-octane reports and stories across F1, Tech, and Global Sports.";
  
  if (category && category !== "All") {
    title = `${category} Archive | Pulse AI`;
    description = `Explore our expert-curated ${category} stories and tactical insights.`;
  } else if (q) {
    title = `Search: "${q}" | Pulse AI`;
    description = `Results for your deep dive into ${q} on Pulse AI.`;
  }

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog`,
      siteName: "Pulse AI",
      type: "website",
    }
  };
}

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
    <div className="flex flex-col min-h-screen bg-black text-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      
      <div className="flex flex-col gap-12 md:gap-16 pb-24 pt-16 px-4 md:px-6 container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 relative">
           <div className="flex items-center gap-3 bg-secondary/10 px-5 py-2 rounded-full border border-white/5 shadow-skeuo-in">
              <Database className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Archive Access Protocol</span>
           </div>
           
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
              Stories <span className="text-primary italic">Archive.</span>
           </h1>
           
           <p className="text-white/30 max-w-lg text-sm md:text-base font-medium uppercase tracking-tight italic">
              Accessing <span className="text-primary font-black tracking-widest px-2">{count || 0}</span> modules across the grid.
           </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between border-y border-white/5 py-6 bg-secondary/[0.01] shadow-skeuo-in px-6 md:px-10 rounded-[1.5rem]">
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <CategoryFilter />
          </div>
          <div className="w-full md:w-[300px] relative">
            <Search />
          </div>
        </div>

        {/* Stories Grid */}
        <div className="relative">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {posts.map((post: any, i: number) => (
                <PostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 border-2 border-white/5 rounded-[3rem] bg-secondary/10 shadow-skeuo-in relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
               <Zap className="h-16 w-16 mx-auto text-primary/10 mb-6 animate-pulse" />
               <h3 className="text-3xl font-black mb-3 uppercase italic">Zero Pulse Detected.</h3>
               <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px]">Awaiting next intelligence broadcast...</p>
            </div>
          )}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-10 border-t border-white/5">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>

      {/* Side Decorative Terminal Text */}
      <div className="fixed bottom-10 left-6 hidden xl:block pointer-events-none select-none">
         <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/5 vertical-text">
            ARCHIVE // PULSE AI NETWORK V2.0
         </p>
      </div>
    </div>
  );
}
