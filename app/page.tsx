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
  const featuredPost = allPosts[0];
  const gridPosts = allPosts.slice(1, 7);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* 1. Hero Section */}
      <AnimatedHero />

      {/* 2. Stats/Editorial Hub Bar */}
      <section 
        className="animate-in fade-in zoom-in-95 duration-1000 relative z-10 py-10 md:py-16 border-y border-white/5 glass-dark shadow-premium"
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
                <div className="text-3xl md:text-5xl font-black text-white tracking-tighter italic group-hover:text-primary transition-all duration-500">
                  {stat.val}
                </div>
                <div className="text-[8px] uppercase font-black tracking-[0.6em] text-white/20 mt-3 border-l-2 border-primary/20 pl-4 group-hover:border-primary transition-colors">
                  {stat.label}
                </div>
                {/* Subtle Glow behind */}
                <div className="absolute -inset-4 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-2xl transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Editor's Pick Section */}
      {featuredPost && (
        <section className="relative z-10 py-20 md:py-24 px-6">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-10">
               <span className="w-10 h-1 bg-primary shadow-glow-red" />
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary">The Editor's Pick</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
              {/* Left Side: Visual */}
              <div className="lg:col-span-5 group relative">
                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 shadow-soft bg-secondary/5 relative transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-glow-red">
                    <img 
                      src={featuredPost.feature_image_url} 
                      alt={featuredPost.feature_image_alt || featuredPost.title} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                    
                    <Badge className="absolute top-6 left-6 bg-primary/90 text-white border-none py-1.5 px-5 rounded-full font-black uppercase text-[9px] tracking-widest shadow-skeuo-button">
                       Featured
                    </Badge>
                  </div>
                </Link>
              </div>

              {/* Right Side: Typography */}
              <div className="lg:col-span-7 space-y-6 md:space-y-8">
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.95] uppercase italic group-hover:text-primary transition-colors duration-500">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-lg text-white/40 leading-relaxed max-w-2xl font-medium uppercase tracking-tight">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-5 pt-2">
                   <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center glass-dark bg-secondary/5 group overflow-hidden">
                      <img src="/logo.svg" alt="" className="h-6 w-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Digital Editorial Team</p>
                      <p className="text-[9px] uppercase font-bold text-primary tracking-widest mt-1 italic">Verified Publisher</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Latest Stories Grid */}
      <section className="relative z-10 py-20 md:py-24 bg-secondary/[0.02] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              Latest <span className="text-primary italic">Stories.</span>
            </h2>
            <Link href="/blog" className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:translate-x-2 transition-all shadow-glow-red px-6 py-3 rounded-full bg-black/40 border border-primary/20 glass hover:bg-primary/10">
               Access Intelligence Archive <ChevronRight className="h-3 w-3" />
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
      <section className="relative z-10 py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
              Why We <span className="text-primary italic text-glow-red">Obsess</span> Over Quality
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
              <p className="text-base md:text-lg text-white/50 font-medium leading-relaxed uppercase tracking-tight">
                Most AI blogs just regurgitate data. We engineer stories. Our algorithms are tuned to find the pulse of a topic, while our editorial team ensures the human soul remains intact. This is where intelligence meets passion.
              </p>
              <p className="text-base md:text-lg text-white/50 font-medium leading-relaxed uppercase tracking-tight">
                Our mission is simple: to provide high-octane reports that move you. Whether it's the roar of an F1 engine or the silence of a deep neural network, we capture the essence of what matters. Read deep, stay tuned.
              </p>
            </div>
            <div className="pt-6 flex justify-center">
              <Link href="/sign-up" className="bg-primary hover:glow-red-strong text-white px-10 md:px-14 py-5 md:py-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all transform hover:scale-[1.03] shadow-soft">
                Join the Network
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      </section>

      {/* 6. Footer Terminal Theme */}
      <footer className="relative z-10 py-16 md:py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-10">
             <div className="flex flex-col items-center gap-5">
                <Logo size="md" />
                <div className="flex items-center gap-2 text-white/20">
                   <div className="w-10 h-[1px] bg-white/10" />
                   <p className="text-[9px] font-black uppercase tracking-[0.5em]">Terminal Protocol 2.0</p>
                   <div className="w-10 h-[1px] bg-white/10" />
                </div>
             </div>
             
             <div className="flex flex-wrap justify-center gap-8 md:gap-14">
                {[
                  { name: "Intelligence", href: "/dashboard" },
                  { name: "Editorial", href: "/blog" },
                  { name: "Archive", href: "/blog" },
                  { name: "Terminal", href: "/admin" }
                ].map(link => (
                  <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors duration-300">
                    {link.name}
                  </Link>
                ))}
             </div>
             
             <div className="text-center pt-8">
                <span className="text-[9px] font-black uppercase tracking-[0.8em] text-white/10">
                  © 2024 PULSE AI NETWORK. ALL RIGHTS RESERVED.
                </span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
