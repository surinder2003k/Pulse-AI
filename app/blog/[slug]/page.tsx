import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButtons from "@/components/ShareButtons";
import RelatedPosts from "@/components/RelatedPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ChevronLeft, Sparkles, Zap, Pencil } from "lucide-react";
import Link from "next/link";

import { clerkClient, auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug }).select("title excerpt feature_image_url tags").lean() as IPost | null;

  if (!post) return { title: 'Story Missing' };

  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pulse-blog-ai.vercel.app'}/blog/${slug}`;

  return {
    title: `${post.title} | Pulse AI`,
    description: post.excerpt,
    keywords: `${post.tags?.join(", ") || ""}, Pulse Editorial, F1 Reports, Football Deep Dives, Real-time Stories, Premium Content`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      siteName: "Pulse AI",
      images: [
        {
          url: post.feature_image_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.createdAt?.toString(),
      authors: ["Pulse AI Editorial"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.feature_image_url || "/og-image.png"],
    },
  };
}

export default async function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const postRaw = await Post.findOne({ slug }).lean() as IPost | null;

  if (!postRaw) notFound();
  
  const post = JSON.parse(JSON.stringify(postRaw)) as IPost;

  let authorName = "Digital Editor";
  let authorRole = "Pulse AI Systems";

  if (post.user_id && post.user_id !== "system_automation") {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(post.user_id);
      if (user) {
        authorName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Storyteller";
        authorRole = "Verified Creator";
      }
    } catch (e) {
      console.warn("Failed to fetch user from Clerk", e);
      authorName = "Pulse Admin";
      authorRole = "Editor-in-Chief";
    }
  }

  const { userId: currentUserId } = await auth();
  let canEdit = false;
  
  if (currentUserId) {
    if (currentUserId === post.user_id) {
      canEdit = true;
    } else {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(currentUserId);
        const role = user?.publicMetadata?.role as string || 'user';
        const email = user?.emailAddresses[0]?.emailAddress;
        if (role === 'admin' || email === ADMIN_EMAIL) {
          canEdit = true;
        }
      } catch (e) {
        console.error("Failed to check admin status", e);
      }
    }
  }

  const readingTime = calculateReadingTime(post.content);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/blog/${post.slug}`;

  return (
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 opacity-30" />
      
      <article className="max-w-4xl mx-auto pb-40 pt-32 px-6 relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-3 text-white/30 hover:text-primary transition-all mb-16 group font-black uppercase tracking-[0.3em] text-[10px] shadow-skeuo-button bg-secondary/10 px-8 py-3 rounded-full border border-white/5">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </Link>

        <header className="space-y-12 mb-20">
          <div className="flex flex-wrap items-center gap-6">
            <Badge className="bg-primary/90 text-white border-none px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-skeuo-button">
              {post.category}
            </Badge>
            <div className="flex items-center gap-8 text-[11px] text-white/40 font-black uppercase tracking-widest bg-secondary/10 shadow-skeuo-in px-8 py-3 rounded-full border border-white/5">
              <span className="flex items-center gap-3"><Calendar className="h-4 w-4 text-primary" /> {formatDate(post.createdAt || post.published_at)}</span>
              <span className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> {readingTime} READ</span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] uppercase italic text-white decoration-primary/20 decoration-[10px] group">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-1 bg-primary w-20 shadow-skeuo-button" />
                  <p className="text-lg text-white/40 font-medium uppercase tracking-tight max-w-xl italic">
                     {post.excerpt}
                  </p>
               </div>
               
               {canEdit && (
                <Link href={`/dashboard/edit/${post.slug}`}>
                  <Button className="rounded-2xl h-16 px-10 bg-secondary/20 hover:bg-white/10 text-white shadow-skeuo-button border border-white/10 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-4">
                    <Pencil className="h-5 w-5 text-primary" />
                    Edit Sequence
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="relative aspect-[16/9] rounded-[4rem] overflow-hidden mb-24 border border-white/5 bg-secondary/10 shadow-skeuo-float">
          <Image
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={post.title}
            fill
            className="object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 transform hover:scale-[1.02]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        <div className="relative prose-container">
          <MarkdownRenderer content={post.content} className="max-w-none" />
        </div>

        {/* Global Share & Author Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-12 border-y border-white/5 gap-12 mt-32 bg-secondary/[0.03] px-12 rounded-[3.5rem] shadow-skeuo-in">
          <div className="flex items-center gap-8">
            <div className="h-24 w-24 rounded-3xl bg-secondary/10 flex items-center justify-center shadow-skeuo-button border border-white/10 rotate-2 group hover:rotate-0 transition-transform">
               <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="h-8 w-8 text-primary" />
               </div>
            </div>
            <div>
              <p className="font-black text-3xl text-white leading-none italic uppercase tracking-tighter">{authorName}</p>
              <div className="flex items-center gap-3 mt-4">
                 <Zap className="h-3 w-3 text-primary animate-pulse" />
                 <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">{authorRole}</p>
              </div>
            </div>
          </div>
          <div className="bg-black/40 p-4 rounded-3xl shadow-skeuo-button border border-white/5">
             <ShareButtons url={shareUrl} title={post.title} />
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-24">
            {post.tags.map((tag: string) => (
              <Badge key={tag} className="bg-secondary/10 border-white/5 text-white/30 hover:text-primary hover:border-primary/20 transition-all cursor-default px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-skeuo-button hover:shadow-skeuo-button-pressed">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Next Story / Related Content */}
        <section className="mt-40 border-t border-white/5 pt-32">
          <div className="flex items-center gap-4 mb-20">
             <div className="w-12 h-1 bg-primary shadow-skeuo-button" />
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">Related <span className="text-primary italic">Intelligence</span></h2>
          </div>
          <RelatedPosts currentSlug={post.slug} category={post.category} />
        </section>
      </article>
    </div>
  );
}
