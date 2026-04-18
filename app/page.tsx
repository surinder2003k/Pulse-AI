import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, TrendingUp, Globe, Brain, Quote, ChevronRight } from "lucide-react";
import AnimatedHero from "@/components/AnimatedHero";
import ParticleBackground from "@/components/ParticleBackground";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

export const revalidate = 0;
export const metadata = {
  title: "Pulse AI | High-Octane Intelligence Reports",
  description: "The next generation of AI-driven editorial content. Engineering stories across F1, Global Sports, and Deep Tech with tactical precision.",
  openGraph: {
    title: "Pulse AI | High-Octane Intelligence Reports",
    description: "The next generation of AI-driven editorial content.",
    url: "https://pulse-blog-ai.vercel.app",
    siteName: "Pulse AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default async function HomePage() {
  await connectDB();
  const postsRaw = await Post.find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(7)
    .lean();

  const allPosts = JSON.parse(JSON.stringify(postsRaw));
  const gridPosts = allPosts.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* 1. Hero Section */}
      <AnimatedHero />

      <section 
        className="animate-in fade-in zoom-in-95 duration-1000 relative z-10 py-10 md:py-16 border-y border-gray-100 bg-white shadow-sm"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {[
              { label: "Intelligence Reports", val: "1,420+" },
              { label: "Network Bandwidth", val: "99.8%" },
              { label: "Global Reach", val: "140+" },
              { label: "Engine Uptime", val: "24/7" },
            ].map((stat) => (
              <div key={stat.label} className="group cursor-default relative">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-all duration-500">
                  {stat.val}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-2 border-l-2 border-gray-200 pl-4 group-hover:border-primary transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 4. Latest Stories Grid */}
      <section className="relative z-10 py-20 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Latest Stories
            </h2>
            <Link href="/blog" className="text-sm font-semibold text-primary flex items-center gap-2 hover:translate-x-2 transition-all px-6 py-2.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10">
               Access Intelligence Archive <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {gridPosts.map((post: any, i: number) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Philosophy */}
      <section className="relative z-10 py-20 md:py-28 overflow-hidden bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-snug mb-4">
              Why We <span className="text-primary">Obsess</span> Over Quality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Most AI blogs just regurgitate data. We engineer stories. Our algorithms are tuned to find the pulse of a topic, while our editorial team ensures the human soul remains intact. This is where intelligence meets passion.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Our mission is simple: to provide high-octane reports that move you. Whether it's the roar of an F1 engine or the silence of a deep neural network, we capture the essence of what matters. Read deep, stay tuned.
              </p>
            </div>
            <div className="pt-6 flex justify-center">
              <Link href="/sign-up" className="bg-primary hover:bg-primary/90 text-white px-10 md:px-12 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-md hover:shadow-lg">
                Join the Network
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer Terminal Theme */}
      <footer className="relative z-10 py-12 md:py-16 border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-10">
             <div className="flex flex-col items-center gap-5">
                <Logo size="md" />
                <div className="flex items-center gap-4 text-gray-400">
                   <div className="w-12 h-[1px] bg-gray-200" />
                   <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Pulse AI Protocol 2.0</p>
                   <div className="w-12 h-[1px] bg-gray-200" />
                </div>
             </div>
             
             <div className="flex flex-wrap justify-center gap-8 md:gap-14">
                {[
                  { name: "Intelligence", href: "/dashboard" },
                  { name: "Editorial", href: "/blog" },
                  { name: "Archive", href: "/blog" },
                  { name: "Terminal", href: "/admin" }
                ].map(link => (
                  <Link key={link.name} href={link.href} className="text-sm font-semibold tracking-wider text-gray-500 hover:text-gray-900 transition-colors duration-300">
                    {link.name}
                  </Link>
                ))}
             </div>
             
             <div className="text-center pt-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  © 2024 PULSE AI NETWORK. ALL RIGHTS RESERVED.
                </span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
