"use client";

import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Eye, Clock, ArrowRight, Zap, TrendingUp } from "lucide-react";
import { calculateReadingTime, cn } from "@/lib/utils";

interface PostCardProps {
  post: any;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const readingTime = calculateReadingTime(post.content || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[2rem] bg-secondary/10 border border-white/5 shadow-skeuo-out aspect-[4/3] group-hover:shadow-skeuo-float transition-all duration-700">
          {/* Main Image */}
          <img
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={post.title}
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
          />
          
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* AI Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-primary/90 text-white px-4 py-1.5 rounded-full shadow-skeuo-button border border-white/10">
            <Zap className="h-3 w-3 fill-white animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">AI Gen</span>
          </div>

          {/* Bottom Info Floating on Glass */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-8 bg-primary shadow-skeuo-button" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 group-hover:text-primary transition-colors">
                 {post.category}
               </span>
            </div>
          </div>
          
          {/* Inner Highlight Reflection */}
          <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Text Content below Card */}
        <div className="mt-6 space-y-4 px-2">
          <div className="flex items-center gap-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <Calendar className="h-3 w-3" /> 
              {(() => {
                const date = new Date(post.createdAt || post.published_at || new Date());
                return !isNaN(date.getTime()) ? format(date, 'MMM dd, yyyy') : 'N/A';
              })()}
            </span>
            <span className="flex items-center gap-2 italic text-primary"><Clock className="h-3 w-3" /> {readingTime}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white leading-tight uppercase italic tracking-tighter group-hover:text-primary transition-colors duration-500 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-[13px] text-white/30 font-medium leading-relaxed line-clamp-2 uppercase tracking-tight group-hover:text-white/50 transition-colors">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
             Read Protocol <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
