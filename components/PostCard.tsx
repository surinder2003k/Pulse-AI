import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, Eye, User, ArrowRight } from "lucide-react";
import { formatDate, calculateReadingTime, cn } from "@/lib/utils";

interface PostCardProps {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    feature_image_url: string;
    created_at?: string;
    createdAt?: string;
    published_at?: string;
    content: string;
    is_ai_generated: boolean;
    author_name?: string;
    author_image?: string;
  };
  isFeatured?: boolean;
}

export default function PostCard({ post, isFeatured }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className={cn(
        "flex gap-8 h-full transition-all duration-300",
        isFeatured ? "flex-col md:flex-row items-center" : "flex-col"
      )}>
        <div className={cn(
          "relative overflow-hidden rounded-2xl border border-white/5 bg-secondary/20 shadow-2xl",
          isFeatured ? "aspect-video md:aspect-[4/3] w-full md:w-1/2" : "aspect-[16/10] w-full"
        )}>
          <Image
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={`${post.title} - ${post.category} article on Pulse AI`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={isFeatured}
            loading={isFeatured ? "eager" : "lazy"}
          />
          <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
            <Badge className="bg-white/20 backdrop-blur-xl border-white/20 text-white font-bold text-xs py-1.5 px-4 rounded-full shadow-lg">
              {post.category}
            </Badge>
          </div>
        </div>
        
        <div className={cn(
          "flex flex-col gap-5 flex-1",
          isFeatured ? "py-4 md:py-8" : ""
        )}>
          <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {formatDate(post.published_at || post.createdAt || post.created_at || new Date())}</span>
            {isFeatured && <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Must Read</Badge>}
          </div>
          
          <h3 className={cn(
            "font-black leading-tight group-hover:text-primary transition-colors",
            isFeatured ? "text-3xl md:text-5xl lg:text-6xl" : "text-xl line-clamp-2"
          )}>
            {post.title}
          </h3>
          
          <p className={cn(
            "text-muted-foreground leading-relaxed italic",
            isFeatured ? "text-lg md:text-xl line-clamp-3" : "text-sm line-clamp-2"
          )}>
            {post.excerpt}
          </p>
          
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 shadow-purple overflow-hidden">
                {post.author_image ? (
                  <img src={post.author_image} alt={`${post.author_name || "Author"} - Pulse AI writer`} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-tighter line-clamp-1">
                  {post.author_name || "Admin"}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold">{readingTime} MIN READ</span>
              </div>
            </div>
            <span className="text-xs font-black text-primary uppercase tracking-widest group-hover:translate-x-2 transition-transform flex items-center gap-2">
              Read Story <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
