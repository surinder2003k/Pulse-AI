"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Detect if content is HTML (from new rich text editor) or Markdown (legacy)
function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const proseClasses = cn(
    "prose prose-invert prose-cyan max-w-none",
    "prose-headings:scroll-mt-20 prose-headings:font-black prose-headings:tracking-tight",
    "prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-10 text-white",
    "prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:text-white prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6",
    "prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-10 prose-h3:mb-6 prose-h3:text-white/90",
    "prose-p:text-xl prose-p:leading-[1.8] prose-p:text-white/70 prose-p:mb-8",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-bold transition-all",
    "prose-ul:my-8 prose-ul:list-disc prose-li:text-white/70 prose-li:leading-relaxed prose-li:mb-4 prose-li:pl-2",
    "prose-ol:my-8 prose-ol:list-decimal prose-li:marker:text-primary prose-li:marker:font-black",
    "prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-16 prose-img:border prose-img:border-white/10",
    "prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:text-white/90 prose-blockquote:my-12",
    "prose-strong:text-white prose-strong:font-black",
    className
  );

  // Normalize bad AI outputs
  const isHtml = isHtmlContent(content);
  
  let processedContent = content || "";

  if (isHtml) {
    // If it's HTML, sometimes ReactQuill/AI just put a bunch of text separated by <br> inside a single <p>. 
    // This explicitly converts <br> into separate paragraphs, triggering the prose-p spacing.
    processedContent = processedContent.replace(/<br\s*\/?>/gi, "</p><p>");
    
    // Also try to detect lines inside HTML that function as headings but lack HTML tags.
    // e.g. <p>Introduction</p> => <h2>Introduction</h2>
    processedContent = processedContent.replace(/<p>([A-Z][A-Za-z0-s\s?]{2,50})<\/p>/g, (match, text) => {
        if (!text.endsWith('.') && text.length < 60) {
            return `<h2>${text}</h2>`;
        }
        return match;
    });

    return (
      <div
        className={cn(proseClasses, "rich-text-output")}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  }

  // If it's Markdown but lacks double newlines, force double newlines so ReactMarkdown parses them as separate paragraphs.
  processedContent = processedContent.replace(/\n/g, '\n\n').replace(/\n{3,}/g, '\n\n');
  
  // Try to "upgrade" pseudo headings in markdown
  // Matches short lines without periods
  processedContent = processedContent.replace(/^([A-Z][^.\n]{2,50})\n/gm, (match, p1) => {
      // If it looks like a heading (e.g. "Introduction" or "What is hydrogen?"), make it an actual heading.
      if (!p1.includes(':') && !p1.startsWith('#')) {
          return `## ${p1}\n`;
      }
      return match;
  });

  return (
    <div className={proseClasses}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
