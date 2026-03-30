"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose prose-invert prose-cyan max-w-none",
      // Headings - Bold, Italic, and spaced out
      "prose-headings:scroll-mt-20 prose-headings:font-black prose-headings:italic prose-headings:tracking-tight",
      "prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:mb-12",
      "prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:text-white prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6",
      "prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-white/90",
      
      // Paragraphs - Better spacing and leading
      "prose-p:text-lg md:prose-p:text-xl prose-p:leading-[1.8] prose-p:text-white/70 prose-p:mb-8 prose-p:font-medium",
      
      // Links
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-bold transition-all",
      
      // Lists
      "prose-ul:my-8 prose-ul:list-disc prose-li:text-white/70 prose-li:leading-relaxed prose-li:mb-4 prose-li:pl-2",
      "prose-ol:my-8 prose-ol:list-decimal prose-li:marker:text-primary prose-li:marker:font-black",
      
      // Images
      "prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-16 prose-img:border prose-img:border-white/10",
      
      // Blockquotes
      "prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:text-white/90 prose-blockquote:my-12",
      
      // Strong/Bold
      "prose-strong:text-white prose-strong:font-black",
      
      className
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
