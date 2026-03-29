import { Badge } from "@/components/ui/badge";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight, Github, Twitter } from "lucide-react";
import AnimatedHero from "@/components/AnimatedHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse AI | Discover Next-Gen AI Content & Stories",
  description: "Dive into the future of blogging with Pulse AI. Explore high-quality, automated trending stories in technology, science, and artificial intelligence.",
  keywords: ["AI trending stories", "automated tech blog", "next-gen content platform", "AI journalism India", "futuristic blogging experience"],
};

export const revalidate = 0;

export default async function HomePage() {
  await connectDB();
  const posts = await Post.find({ status: "published" })
    .sort({ published_at: -1 })
    .limit(7)
    .lean();

  const featuredPost = posts?.[0] ? JSON.parse(JSON.stringify(posts[0])) : null;
  const recentPosts = posts?.slice(1).map(p => JSON.parse(JSON.stringify(p))) || [];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <AnimatedHero />

      {/* Featured Story */}
      {featuredPost && (
        <section className="container mx-auto max-w-7xl px-6 space-y-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="text-3xl font-black flex items-center gap-3 italic">
              Featured Story
            </h2>
          </div>
          <PostCard post={featuredPost} isFeatured={true} />
        </section>
      )}

      {/* Grid Section */}
      <section className="container mx-auto max-w-7xl px-6 space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-3xl font-black italic">Latest Stories</h2>
          <Link href="/blog" className="text-primary font-bold flex items-center gap-2 hover:underline group">
            View All Articles <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-secondary/10">
            <p className="text-muted-foreground italic">No posts found. Grok is brewing something special!</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-20 pb-10 flex flex-col items-center gap-6 text-center px-6">
        <div className="flex items-center gap-2 font-bold text-xl uppercase italic">
          <Sparkles className="h-5 w-5 text-primary" />
          Pulse AI
        </div>
        <p className="text-muted-foreground text-sm max-w-md">
          Sharing insights and stories powered by artificial intelligence and modern web technologies.
        </p>
        <div className="flex gap-6 mt-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-white">Home</Link>
          <Link href="/blog" className="text-xs text-muted-foreground hover:text-white">Blog</Link>
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-white">Dashboard</Link>
        </div>
        <div className="flex gap-5 mt-4 items-center">
          <Link 
            href="https://github.com/surinder2003k" 
            target="_blank" 
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all group scale-90 hover:scale-100"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link 
            href="#" 
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all group scale-90 hover:scale-100"
          >
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-10 uppercase tracking-widest">
          © 2026 Pulse AI - Built with AI & Next.js
        </p>
      </footer>
    </div>
  );
}
