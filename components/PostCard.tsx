import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, Eye, User, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { formatDate, calculateReadingTime, cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        "flex gap-10 h-full transition-all duration-500",
        isFeatured ? "flex-col md:flex-row items-stretch" : "flex-col"
      )}>
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-black w-full transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-[0_0_50px_rgba(255,51,51,0.15)]",
          isFeatured ? "aspect-square md:aspect-[4/5] md:w-[45%]" : "aspect-[16/11]"
        )}>
          <Image
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={post.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={isFeatured}
            loading={isFeatured ? "eager" : "lazy"}
          />
          
          {/* Subtle Red Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

          {/* Floating Badge */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-black/80 backdrop-blur-xl border-white/20 text-white font-black text-[10px] uppercase tracking-[0.3em] py-2 px-5 rounded-full shadow-2xl flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {post.category}
            </Badge>
          </div>
        </div>
        
        {/* Content Container */}
        <div className={cn(
          "flex flex-col gap-8 flex-1 py-4",
          isFeatured ? "md:py-12" : ""
        )}>
          {/* Metadata */}
          <div className="flex items-center gap-6 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary/60" /> 
              {formatDate(post.published_at || post.createdAt || post.created_at || new Date())}
            </span>
            {post.is_ai_generated && (
              <span className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-3.5 w-3.5" /> 
                HYPER-INTELLIGENCE
              </span>
            )}
          </div>
          
          {/* Title */}
          <h3 className={cn(
            "font-black leading-[0.95] tracking-tighter group-hover:text-primary transition-colors duration-500 uppercase italic",
            isFeatured ? "text-4xl md:text-7xl lg:text-8xl" : "text-2xl md:text-3xl line-clamp-2"
          )}>
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className={cn(
            "text-muted-foreground leading-relaxed font-medium",
            isFeatured ? "text-lg md:text-2xl line-clamp-4" : "text-sm line-clamp-3"
          )}>
            {post.excerpt}
          </p>
          
          {/* Footer Info */}
          <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-primary/50 transition-colors">
                {post.author_image ? (
                  <img src={post.author_image} alt={post.author_name || "Author"} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  {post.author_name || "SYSTEM ARCHITECT"}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{readingTime} MIN READ</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
              EXPLORE <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
