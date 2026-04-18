import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import Search from "@/components/Search";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { Suspense } from "react";
import { PostGridSkeleton } from "@/components/LoadingSkeleton";
import Link from "next/link";
import { Database, Zap, BookOpen, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      <div className="flex flex-col gap-10 md:gap-14 pb-24 pt-16 px-4 md:px-6 container mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 relative">
           <div className="flex items-center gap-3 bg-primary/5 px-5 py-2 rounded-full border border-gray-200">
              <Database className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Archive Access Protocol</span>
           </div>
           
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Stories <span className="text-primary inline-block">Archive</span>
           </h1>
           
           <p className="text-gray-500 max-w-lg text-sm md:text-base font-medium">
              Accessing <span className="text-primary font-bold">{count || 0}</span> modules across the grid.
           </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between border-y border-gray-100 py-6 bg-white shadow-sm px-6 md:px-10 rounded-3xl">
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
            <div className="py-24 px-8 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 bg-gray-50 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden group">
               
               <div className="relative group inline-block mb-10">
                  <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-200 mx-auto">
                     <Zap className="h-8 w-8 text-primary opacity-50" />
                  </div>
               </div>
               
               <div className="space-y-4 max-w-lg mx-auto">
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
                    Zero Pulse Detected
                  </h2>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed border-y border-gray-200 py-6">
                    The requested data sequence is unavailable. Diagnostics suggest modifying parameters or returning to the base directory.
                  </p>
               </div>

               <div className="mt-10 flex flex-col items-center gap-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Available Domains:</p>
                  <div className="flex flex-wrap justify-center gap-3">
                     {["F1", "Football", "Cricket", "Tech"].map(cat => (
                        <Link key={cat} href={`/blog?category=${cat}`}>
                           <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                              {cat}
                           </button>
                        </Link>
                     ))}
                  </div>
                  <Link href="/blog" className="mt-4">
                     <button className="text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary/5 px-8 py-3 rounded-full border border-primary/20 transition-all active:scale-95 shadow-sm">
                        Reset Uplink Matrix
                     </button>
                  </Link>
               </div>
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
         <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-gray-200 vertical-text">
            ARCHIVE // PULSE AI NETWORK V2.0
         </p>
      </div>
    </div>
  );
}
