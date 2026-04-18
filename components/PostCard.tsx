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
        <div className="relative overflow-hidden rounded-3xl bg-gray-100 border border-gray-200 shadow-sm aspect-[4/3] transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-md">
          {/* Main Image */}
          <img
            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"}
            alt={post.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Subtle Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

          {/* AI Badge & Protocol ID */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 group-hover:border-primary/50 transition-colors">
              <Zap className="h-3 w-3 fill-white/80 animate-pulse text-white/80" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">Protocol: AI-GEN</span>
            </div>
            <span className="text-[8px] font-mono text-white/60 uppercase tracking-[0.3em] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">X-REF // {Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
          </div>

          {/* Bottom Info Floating on Glass */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3">
               <div className="h-[2px] w-6 bg-primary transition-all group-hover:w-12" />
               <span className="text-xs font-bold uppercase tracking-widest text-white/90 group-hover:text-primary transition-colors">
                 {post.category}
               </span>
            </div>
          </div>
        </div>

        {/* Text Content below Card */}
        <div className="mt-6 space-y-3 px-1">
          <div className="flex items-center gap-5 text-xs font-semibold text-gray-500 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> 
              {(() => {
                const date = new Date(post.createdAt || post.published_at || new Date());
                return !isNaN(date.getTime()) ? format(date, 'MMM dd, yyyy • hh:mm a') : 'N/A';
              })()}
            </span>
            <span className="flex items-center gap-2 text-primary/80 group-hover:text-primary transition-colors"><Clock className="h-3.5 w-3.5" /> {readingTime}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 font-medium leading-relaxed line-clamp-2 group-hover:text-gray-800 transition-colors">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
             Read Report <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
