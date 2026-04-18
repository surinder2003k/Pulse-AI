import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
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
  const post = await Post.findOne({ slug }).select("title excerpt feature_image_url tags meta_title meta_description focus_keyword").lean() as IPost | null;

  if (!post) return { title: 'Story Missing' };

  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pulse-blog-ai.vercel.app'}/blog/${slug}`;

  return {
    title: (post.meta_title || post.title) + " | Pulse AI",
    description: post.meta_description || post.excerpt,
    keywords: `${post.focus_keyword || ""}, ${post.tags?.join(", ") || ""}, Pulse Editorial, F1 Reports, Football Deep Dives, Real-time Stories, Premium Content`,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: url,
      siteName: "Pulse AI",
      images: [
        {
          url: post.feature_image_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.meta_title || post.title,
        },
      ],
      type: "article",
      publishedTime: post.createdAt?.toString(),
      authors: ["Pulse AI Editorial"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
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
    <div className="bg-white min-h-screen text-gray-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 opacity-50" />
      
      <article className="max-w-4xl mx-auto pb-40 pt-32 px-6 relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-all mb-16 group font-bold uppercase tracking-widest text-xs shadow-sm bg-gray-50 px-8 py-3 rounded-full border border-gray-200">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>

        <header className="space-y-12 mb-20">
          <div className="flex flex-wrap items-center gap-6">
            <Badge className="bg-primary/90 text-white border-none px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              {post.category}
            </Badge>
            <div className="flex items-center gap-8 text-xs text-gray-500 font-bold uppercase tracking-wider bg-white shadow-sm px-8 py-3 rounded-full border border-gray-200">
              <span className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-primary" /> 
                {(() => {
                  const date = new Date(post.createdAt || post.published_at);
                  return !isNaN(date.getTime()) ? format(date, 'MMM dd, yyyy • hh:mm a') : 'N/A';
                })()}
              </span>
              <span className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> {readingTime} READ</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-gray-900">
              {post.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
               <div className="flex gap-5">
                  <div className="w-1.5 rounded-full bg-primary shrink-0 hidden md:block" />
                  <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl">
                     {post.excerpt}
                  </p>
               </div>
               
               {canEdit && (
                <Link href={`/dashboard/edit/${post.slug}`}>
                  <Button className="rounded-full h-14 px-8 bg-gray-50 hover:bg-gray-100 text-gray-900 shadow-sm border border-gray-200 transition-all font-bold uppercase tracking-wider text-xs flex items-center gap-4">
                    <Pencil className="h-4 w-4 text-primary" />
                    Edit Article
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-24 border border-gray-200 bg-gray-50 shadow-sm">
          <Image
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={post.feature_image_alt || post.title}
            fill
            className="object-cover transition-all duration-1000 transform hover:scale-[1.02]"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative prose-container">
          <MarkdownRenderer content={post.content} className="max-w-none" />
        </div>

        {/* Global Share & Author Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-12 border-y border-gray-100 gap-12 mt-32 bg-gray-50 px-12 rounded-3xl shadow-sm">
          <div className="flex items-center gap-8">
            <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-200">
               <div className="h-14 w-14 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  <User className="h-6 w-6 text-primary" />
               </div>
            </div>
            <div>
              <p className="font-bold text-2xl text-gray-900 leading-none tracking-tight">{authorName}</p>
              <div className="flex items-center gap-3 mt-4">
                 <Zap className="h-3 w-3 text-primary animate-pulse" />
                 <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{authorRole}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
             <ShareButtons url={shareUrl} title={post.title} />
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-24">
            {post.tags.map((tag: string) => (
              <Badge key={tag} className="bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-default px-6 py-3 rounded-full text-xs font-bold shadow-sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Next Story / Related Content */}
        <section className="mt-32 border-t border-gray-100 pt-24">
          <div className="flex items-center gap-4 mb-16">
             <div className="w-8 h-1 bg-primary rounded-full" />
             <h2 className="text-3xl font-bold tracking-tight text-gray-900">Related Articles</h2>
          </div>
          <RelatedPosts currentSlug={post.slug} category={post.category} />
        </section>
      </article>
    </div>
  );
}
