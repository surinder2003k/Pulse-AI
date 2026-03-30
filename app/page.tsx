import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Sparkles, ArrowRight, Github, Twitter, Zap, Brain, Globe, TrendingUp } from "lucide-react";
import AnimatedHero from "@/components/AnimatedHero";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { calculateReadingTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pulse AI | Stories That Move You. F1, Tech, & Global Sports.",
  description: "Dive into the pulse of global stories. From high-octane F1 race reports to the deep tactical world of football and the latest in AI innovation, we bring you storytelling with a soul.",
  keywords: [
    "Pulse AI", "F1 race analysis", "Football tactical deep dives", "AI research stories",
    "Skeuomorphic design", "Premium tech blog", "Cricket match insights", "Digital magazine"
  ],
  openGraph: {
    title: "Pulse AI | Stories That Move You.",
    description: "High-octane F1, Football, and Tech stories delivered with a premium skeuomorphic experience.",
    url: "https://pulse-blog-ai.vercel.app",
    siteName: "Pulse AI",
    type: "website",
    images: [{ url: "https://pulse-blog-ai.vercel.app/og-image.png", width: 1200, height: 630, alt: "Pulse AI – Stories with a Soul" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse AI | Stories That Move You.",
    description: "Experience the adrenaline of F1, Football and Tech with Pulse AI's premium storytelling.",
    images: ["https://pulse-blog-ai.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://pulse-blog-ai.vercel.app",
  },
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

  const allDisplayedPosts = [featuredPost, ...recentPosts].filter(Boolean);

  // JSON-LD: Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pulse AI",
    "url": "https://pulse-blog-ai.vercel.app",
    "logo": "https://pulse-blog-ai.vercel.app/logo.svg",
    "description": "Pulse AI is a next-generation Skeuomorphic AI content engine delivering premium stories on F1, football, cricket, technology, and more.",
    "sameAs": [
      "https://github.com/surinder2003k"
    ]
  };

  // JSON-LD: WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Pulse AI | Skeuomorphic AI Stories & Premium Content Engine",
    "description": "Experience next-gen Skeuomorphic AI with Pulse AI. Read premium stories on F1, football, cricket, tech & more in stunning 3D.",
    "url": "https://pulse-blog-ai.vercel.app",
    "publisher": {
      "@type": "Organization",
      "name": "Pulse AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pulse-blog-ai.vercel.app/logo.svg"
      }
    },
    "mainEntity": {
      "@type": "Blog",
      "name": "Pulse AI Blog",
      "description": "AI-powered premium content covering F1, football, cricket, tech, and trending topics."
    }
  };

  // JSON-LD: Article Schema for each post
  const articleSchemas = allDisplayedPosts.map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.feature_image_url || "https://pulse-blog-ai.vercel.app/og-image.png",
    "author": {
      "@type": "Person",
      "name": post.author_name || "Pulse AI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pulse AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pulse-blog-ai.vercel.app/logo.svg"
      }
    },
    "datePublished": post.published_at || post.createdAt || post.created_at,
    "dateModified": post.updatedAt || post.createdAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pulse-blog-ai.vercel.app/blog/${post.slug}`
    },
    "timeRequired": `PT${calculateReadingTime(post.content).replace(' min read', '')}M`,
    "url": `https://pulse-blog-ai.vercel.app/blog/${post.slug}`
  }));

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {articleSchemas.map((schema, i) => (
        <script
          key={`article-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero Section */}
      <AnimatedHero />

      {/* Editorial Mission / Intro Section */}
      <section className="container mx-auto max-w-5xl px-6">
        <div className="relative rounded-[2.5rem] bg-secondary/10 border border-white/5 p-10 md:p-16 space-y-8 overflow-hidden shadow-skeuo-out">
          {/* Subtle glow accent */}
          {/* Premium Ambient Light */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] px-3 py-1 font-black mb-2">The Editorial Pulse</Badge>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tight text-white leading-tight">
              Where Technology Meets the <span className="text-primary underline decoration-primary/30 underline-offset-8">Human Spirit</span>
            </h2>
          </div>

          <div className="space-y-6 text-white/80 text-base md:text-xl leading-[1.75] font-medium relative z-10 max-w-4xl">
            <p>
              We believe that every story has a soul. Pulse AI isn&apos;t just another site — it&apos;s a next-generation 
              <strong className="text-white font-bold"> Content Engine</strong> obsessed with the details that matter. 
              By blending high-octane artificial intelligence with premium design, we&apos;ve built a space where 
              <strong className="text-white font-bold">Skeuomorphic AI storytelling</strong> feels tactile, immersive, and 
              honestly, a bit insane.
            </p>
            <p>
              Whether you&apos;re chasing the adrenaline of the <strong className="text-white font-bold">F1 paddock</strong> during race week, 
              tracking every tactical masterclass on the <strong className="text-white font-bold">football pitch</strong>, or 
              staying up for the final over of a <strong className="text-white font-bold">cricket classic</strong> — we&apos;re right there with you. 
              Our engine curates the world&apos;s data to bring you stories that aren&apos;t just fast, they&apos;re deep. 
              From clinical tech analysis to the raw emotion of global sports, we deliver truth, beautifully.
            </p>
            <p>
              This is the intersection of <strong className="text-white font-bold">design and data</strong>. 
              We&apos;ve traded flat, boring interfaces for a world of depth, shadows, and textures. When you read a story here, 
              you aren&apos;t just scrolling — you&apos;re experiencing a premium digital magazine crafted for those who 
              demand more from their screen.
            </p>
          </div>

          {/* Feature Highlights - Refined Icons & Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 relative z-10 border-t border-white/5">
            {[
              { icon: Brain, label: "Smart Narratives", desc: "AI-powered, but human-focused stories." },
              { icon: Zap, label: "Instant Insight", desc: "Live-data tracking for the trending moment." },
              { icon: Globe, label: "Pure Variety", desc: "F1, Tech, & Sports from a global lens." },
              { icon: TrendingUp, label: "High-Octane SEO", desc: "Stories built to be discovered and shared." },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col gap-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:-translate-y-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{feature.label}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-bold italic">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <section className="container mx-auto max-w-7xl px-6 space-y-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="text-3xl font-black flex items-center gap-3 italic tracking-tight">
              The Editor&apos;s Pick
            </h2>
            <Badge variant="outline" className="border-primary/20 text-primary uppercase font-black text-[10px] tracking-widest bg-primary/5">Featured</Badge>
          </div>
          <PostCard post={featuredPost} isFeatured={true} />
        </section>
      )}

      {/* Grid Section */}
      <section className="container mx-auto max-w-7xl px-6 space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <h2 className="text-3xl font-black italic tracking-tight">Latest Stories</h2>
          <Link href="/blog" className="text-primary font-black uppercase tracking-widest text-[11px] flex items-center gap-2 hover:opacity-80 group">
            Explore All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-secondary/10 shadow-skeuo-in">
            <p className="text-muted-foreground font-black italic tracking-widest uppercase text-sm animate-pulse">Brewing new stories...</p>
          </div>
        )}
      </section>

      {/* Editorial Rationale Section */}
      <section className="container mx-auto max-w-5xl px-6">
        <div className="rounded-[2.5rem] bg-secondary/10 border border-white/5 p-10 md:p-16 space-y-8 shadow-skeuo-in relative overflow-hidden">
           {/* Subtle glow accent */}
           {/* Precision Accent Line */}
           <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <h2 className="text-3xl md:text-4xl font-black italic tracking-tight text-white">
            Why We <span className="text-primary">Obsess</span> Over Quality
          </h2>
          <div className="space-y-6 text-white/80 text-base md:text-xl leading-[1.8] font-medium">
            <p>
              Most sites just regurgitate the same news. We don&apos;t. Every word on Pulse AI is generated with a focus on 
              <strong className="text-white font-bold"> deep context, narrative flow, and factual precision</strong>. 
              We don&apos;t just report on Erling Haaland scoring a hat-trick; we analyze the tactical shift that allowed 
              him to ghost behind the defenders. 
            </p>
            <p>
              Our tech is modern, but our heart is classic. Using <strong className="text-white font-bold">Next.js 15</strong> 
              means we&apos;re fast, but our skeuomorphic design means we&apos;re human. This is data with a pulse — 
              a premium experience for readers who want to stay ahead of the curve, from 
              <strong className="text-white font-bold"> F1 race analysis</strong> to the latest breakthroughs in 
              <strong className="text-white font-bold"> AI research</strong>.
            </p>
            <p>
              Join the ride. This is the future of storytelling, hand-crafted with code and driven by the best 
              artificial intelligence. Welcome home.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-20 pb-10 flex flex-col items-center gap-6 text-center px-6">
        <div className="flex items-center gap-2 font-bold text-xl uppercase italic">
          <Sparkles className="h-5 w-5 text-primary" />
          Pulse AI
        </div>
        <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
          Pulse AI is a premium Skeuomorphic AI content engine sharing insights, stories, and analysis powered
          by artificial intelligence. Covering F1, football, cricket, technology, and trending topics with
          stunning 3D design and modern web technologies.
        </p>
        <nav className="flex gap-6 mt-4" aria-label="Footer navigation">
          <Link href="/" className="text-xs text-muted-foreground hover:text-white transition-colors">Home</Link>
          <Link href="/blog" className="text-xs text-muted-foreground hover:text-white transition-colors">Blog</Link>
          <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
        </nav>
        <div className="flex gap-5 mt-4 items-center">
          <Link 
            href="https://github.com/surinder2003k" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Pulse AI GitHub profile"
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all group scale-90 hover:scale-100"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link 
            href="#" 
            aria-label="Pulse AI Twitter profile"
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 hover:border-primary/50 transition-all group scale-90 hover:scale-100"
          >
            <Twitter className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-10 uppercase tracking-widest">
          © 2026 Pulse AI - Premium Skeuomorphic AI Content Engine - Built with AI & Next.js
        </p>
      </footer>
    </div>
  );
}
