import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Sparkles, ArrowRight, Github, Twitter, Zap, Brain, Globe, TrendingUp } from "lucide-react";
import AnimatedHero from "@/components/AnimatedHero";
import type { Metadata } from "next";
import { calculateReadingTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pulse AI | Skeuomorphic AI Stories & Premium Content Engine",
  description: "Experience next-gen Skeuomorphic AI with Pulse AI. Read premium stories on F1, football, cricket, tech & more in stunning 3D. Discover the future of AI content.",
  keywords: [
    "Skeuomorphic AI", "AI content engine", "premium AI stories", "F1 news AI",
    "football AI blog", "cricket AI content", "tech blog AI", "automated content platform",
    "AI journalism India", "next-gen blogging", "AI storytelling", "Pulse AI blog",
    "artificial intelligence stories", "trending news AI", "smart content generation"
  ],
  openGraph: {
    title: "Pulse AI | Skeuomorphic AI Stories & Premium Content Engine",
    description: "Experience next-gen Skeuomorphic AI with Pulse AI. Read premium stories on F1, football, cricket, tech & more in stunning 3D.",
    url: "https://pulse-blog-ai.vercel.app",
    siteName: "Pulse AI",
    type: "website",
    images: [{ url: "https://pulse-blog-ai.vercel.app/og-image.png", width: 1200, height: 630, alt: "Pulse AI – Skeuomorphic AI Content Engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse AI | Skeuomorphic AI Stories & Premium Content Engine",
    description: "Experience next-gen Skeuomorphic AI with Pulse AI. Read premium stories on F1, football, cricket, tech & more.",
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

      {/* SEO Intro Content Section */}
      <section className="container mx-auto max-w-5xl px-6">
        <div className="relative rounded-[2.5rem] bg-secondary/10 border border-white/5 p-10 md:p-16 space-y-8 overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-black italic tracking-tight text-white relative z-10">
            Welcome to the Future of <span className="text-primary">AI-Powered Content</span>
          </h2>

          <div className="space-y-6 text-white/70 text-base md:text-lg leading-[1.85] font-medium relative z-10">
            <p>
              Pulse AI is the next-generation <strong className="text-white font-bold">Skeuomorphic AI content engine</strong> that transforms how
              you discover, read, and engage with premium stories. Built at the intersection of cutting-edge artificial intelligence
              and stunning 3D visual design, Pulse AI delivers an immersive reading experience unlike anything else on the web.
            </p>
            <p>
              Whether you&apos;re a die-hard <strong className="text-white font-bold">F1 racing enthusiast</strong> tracking the latest season
              developments from Bahrain to Monza, a <strong className="text-white font-bold">football fan</strong> following every goal Erling
              Haaland scores, or a <strong className="text-white font-bold">cricket lover</strong> keeping up with IPL action and international
              tournaments — Pulse AI curates, generates, and presents content tailored to your passions. Our AI engine processes
              thousands of data points in real-time to craft articles that are accurate, well-researched, and engaging.
            </p>
            <p>
              But Pulse AI isn&apos;t just about sports. Dive into the world of <strong className="text-white font-bold">technology and innovation</strong>,
              where we cover everything from the latest breakthroughs in artificial intelligence and machine learning to the newest
              consumer gadgets, startup stories, and the future of the tech industry. Every story is enriched with smart summaries,
              structured insights, and beautiful imagery — all generated and curated by our proprietary AI pipeline.
            </p>
            <p>
              What makes Pulse AI truly special is the <strong className="text-white font-bold">Skeuomorphic design philosophy</strong> that
              powers every pixel of this platform. Inspired by real-world textures, depth, and physicality, our interface brings
              a tactile, premium feel to digital content. From embossed buttons to glossy overlays and subtle shadow play, every
              element is designed to feel alive. This isn&apos;t your ordinary blog — it&apos;s a <strong className="text-white font-bold">premium content experience</strong>{" "}
              built for the modern reader.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 relative z-10">
            {[
              { icon: Brain, label: "AI-Generated Stories", desc: "Smart, accurate content crafted by advanced AI models" },
              { icon: Zap, label: "Real-Time Trending", desc: "Stay ahead with stories powered by live data analysis" },
              { icon: Globe, label: "Global Coverage", desc: "F1, football, cricket, tech — stories from around the world" },
              { icon: TrendingUp, label: "SEO Optimized", desc: "Every article is structured for maximum discoverability" },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide">{feature.label}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Why Pulse AI Section - Extra SEO content */}
      <section className="container mx-auto max-w-5xl px-6">
        <div className="rounded-[2.5rem] bg-secondary/10 border border-white/5 p-10 md:p-16 space-y-8">
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tight text-white">
            Why Readers Choose <span className="text-primary">Pulse AI</span>
          </h2>
          <div className="space-y-6 text-white/70 text-base md:text-lg leading-[1.85] font-medium">
            <p>
              In a world saturated with low-quality, clickbait content, Pulse AI stands apart. Our AI content engine doesn&apos;t
              just scrape and regurgitate — it <strong className="text-white font-bold">understands context, analyzes trends, and generates original narratives</strong>{" "}
              that inform and inspire. Every article goes through multiple AI-driven quality checks to ensure factual accuracy,
              readability, and engagement.
            </p>
            <p>
              The Pulse AI platform is built on <strong className="text-white font-bold">Next.js 15</strong> with server-side rendering for
              lightning-fast page loads, optimized Core Web Vitals, and a seamless reading experience across all devices. Whether
              you&apos;re reading on your phone during a commute or on a 4K monitor at home, every story looks and feels premium.
            </p>
            <p>
              Join thousands of readers who have already discovered a better way to consume content. From daily tech roundups
              to in-depth <strong className="text-white font-bold">F1 race analysis</strong>, from <strong className="text-white font-bold">cricket match previews</strong> to
              the latest in <strong className="text-white font-bold">AI and machine learning research</strong> — Pulse AI is your one-stop
              destination for stories that matter, told beautifully.
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
