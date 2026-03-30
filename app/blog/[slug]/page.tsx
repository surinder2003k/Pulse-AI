import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate, calculateReadingTime } from "@/lib/utils";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButtons from "@/components/ShareButtons";
import RelatedPosts from "@/components/RelatedPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Clock, User, ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import ViewsCounter from "@/components/ViewsCounter";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug }).select("title excerpt feature_image_url tags").lean() as IPost | null;

  if (!post) return { title: 'Post Not Found' };

  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pulse-blog-ai.vercel.app'}/blog/${slug}`;

  return {
    title: `${post.title} | Pulse AI`,
    description: post.excerpt,
    keywords: `${post.tags?.join(", ") || ""}, Pulse AI, AI Blog India, Automated Content, Trending News Artificial Intelligence, Future of Tech, Smart Blogging Engine`,
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
      authors: ["Pulse AI"],
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

  let authorName = "System AI";
  let authorRole = "Automated Content Generator";

  if (post.user_id && post.user_id !== "system_automation") {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(post.user_id);
      if (user) {
        authorName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Content Creator";
        authorRole = "Author";
      }
    } catch (e) {
      console.warn("Failed to fetch user from Clerk", e);
      authorName = "Admin";
      authorRole = "Content Creator";
    }
  }

  const { userId: currentUserId } = await auth();
  let canEdit = false;
  
  if (currentUserId) {
    if (currentUserId === post.user_id) {
      canEdit = true;
    } else {
      // Check if current user is admin
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.feature_image_url || "https://pulse-blog-ai.vercel.app/og-image.png"],
    "datePublished": post.createdAt?.toString() || post.published_at?.toString(),
    "dateModified": post.updatedAt?.toString() || post.createdAt?.toString(),
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://pulse-blog-ai.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pulse AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pulse-blog-ai.vercel.app/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@id": shareUrl,
      "@type": "WebPage"
    }
  };

  return (
    <article className="max-w-4xl mx-auto pb-32 pt-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Views Counter (Client-side trigger) */}
      <ViewsCounter slug={post.slug} />

      <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12 group font-bold uppercase tracking-widest text-[10px]">
        <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Archive
      </Link>

      <header className="space-y-8 mb-16">
        <div className="flex flex-wrap items-center gap-4">
          <Badge className="bg-secondary/40 text-primary border-primary/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-skeuo-button">
            {post.category}
          </Badge>
          <div className="flex items-center gap-6 text-[11px] text-muted-foreground font-black uppercase tracking-widest bg-secondary/20 shadow-skeuo-in px-6 py-2 rounded-full">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {formatDate(post.createdAt || post.published_at)}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {readingTime}</span>
            <span className="flex items-center gap-2 text-white"><Eye className="h-4 w-4 text-primary" /> {post.views} Views</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight italic max-w-4xl">
            {post.title}
          </h1>
          
          {canEdit && (
            <Link href={`/dashboard/edit/${post.slug}`}>
              <Button className="rounded-2xl h-14 px-8 bg-secondary/40 hover:bg-white/10 text-white shadow-skeuo-button active:shadow-skeuo-button-pressed border border-white/10 transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                <Pencil className="h-4 w-4 text-primary" />
                Edit Post
              </Button>
            </Link>
          )}
        </div>


      </header>

      <div className="relative aspect-[16/8] rounded-[3rem] overflow-hidden mb-20 border border-white/5 bg-secondary/20 shadow-skeuo-float">
        <Image
          src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>


      <div className="relative prose-container">
        <MarkdownRenderer content={post.content} className="max-w-none" />
      </div>

      {/* Author & Share Bar Moved to Bottom */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-10 border-y border-white/5 gap-8 mt-20">
        <div className="flex items-center gap-5 bg-secondary/20 p-4 rounded-3xl shadow-skeuo-in">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-skeuo-button border border-primary/20 rotate-3 transition-transform hover:rotate-0">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-black text-xl text-white leading-none italic uppercase">{authorName}</p>
            <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-widest">{authorRole}</p>
          </div>
        </div>
        <ShareButtons url={shareUrl} title={post.title} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-20 pt-10 border-t border-white/5">
          {post.tags.map((tag: string) => (
            <Badge key={tag} className="bg-secondary/30 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all cursor-default px-5 py-3 rounded-2xl text-xs font-bold shadow-skeuo-button hover:shadow-skeuo-button-pressed hover:-translate-y-0.5">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Related Content */}
      <section className="mt-32">
        <RelatedPosts currentSlug={post.slug} category={post.category} />
      </section>
    </article>
  );
}
