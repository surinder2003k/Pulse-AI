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
        <div className="relative overflow-hidden rounded-[2.5rem] bg-black/40 border border-white/5 shadow-premium aspect-[4/3] group-hover:shadow-glow-red transition-all duration-700 group-hover:border-primary/40 glass-dark">
          {/* Cinematic Background Glow (Hover Only) */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 blur-3xl transition-all duration-700 pointer-events-none" />

          {/* Main Image */}
          <img
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={post.title}
            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000"
          />
          
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />

          {/* Tactical Scanning Laser (Hover) */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/60 shadow-glow-red opacity-0 group-hover:opacity-100 group-hover:animate-scan transition-opacity pointer-events-none z-20" />

          {/* AI Badge & Protocol ID */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full border border-white/10 group-hover:border-primary/50 transition-colors">
              <Zap className="h-3 w-3 fill-white animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/70 group-hover:text-white">Protocol: AI-GEN</span>
            </div>
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.4em] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">X-REF // {Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
          </div>

          {/* Bottom Info Floating on Glass */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-4">
               <div className="h-[1px] w-12 bg-primary transition-all group-hover:w-20" />
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-primary transition-colors italic">
                 {post.category}
               </span>
            </div>
          </div>
        </div>

        {/* Text Content below Card */}
        <div className="mt-8 space-y-4 px-2">
          <div className="flex items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> 
              {(() => {
                const date = new Date(post.createdAt || post.published_at || new Date());
                return !isNaN(date.getTime()) ? format(date, 'MMM dd, yyyy') : 'N/A';
              })()}
            </span>
            <span className="flex items-center gap-2 italic text-primary/60 group-hover:text-primary transition-colors"><Clock className="h-3.5 w-3.5" /> {readingTime}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white leading-none uppercase italic tracking-tighter group-hover:text-primary transition-colors duration-500 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-[14px] text-white/30 font-medium leading-relaxed line-clamp-2 uppercase tracking-tight group-hover:text-white/50 transition-colors">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 pt-4 text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-700 italic">
             Access Protocol <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
