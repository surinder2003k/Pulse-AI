"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import parse from "html-react-parser";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Support for mixed content (some AI tags + Markdown)
function containsHtml(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const proseClasses = cn(
    "prose prose-invert prose-red max-w-none",
    "prose-headings:scroll-mt-20 prose-headings:font-black prose-headings:tracking-tight",
    "prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-8 prose-h1:text-white prose-h1:uppercase prose-h1:italic",
    "prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-white prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-6 prose-h2:uppercase prose-h2:italic",
    "prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-white/90 prose-h3:uppercase prose-h3:italic",
    "prose-p:text-base md:prose-p:text-lg prose-p:leading-[1.8] prose-p:text-white/70 prose-p:mb-6 prose-p:font-medium",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-bold prose-a:transition-all",
    "prose-ul:my-6 prose-ul:list-disc prose-li:text-white/70 prose-li:leading-relaxed prose-li:mb-2 prose-li:pl-2",
    "prose-ol:my-6 prose-ol:list-decimal prose-li:marker:text-primary prose-li:marker:font-black",
    "prose-img:rounded-[2.5rem] prose-img:shadow-premium prose-img:my-12 prose-img:border prose-img:border-white/10",
    "prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-[2rem] prose-blockquote:italic prose-blockquote:text-white/90 prose-blockquote:my-12 prose-blockquote:shadow-premium prose-blockquote:border-y prose-blockquote:border-r prose-blockquote:border-white/5",
    "prose-strong:text-white prose-strong:font-black",
    "prose-table:border-collapse prose-table:w-full prose-table:my-12",
    "prose-thead:bg-primary/10 prose-thead:text-primary prose-thead:font-black prose-thead:uppercase prose-thead:tracking-widest",
    "prose-th:px-6 prose-th:py-4 prose-th:border prose-th:border-white/10",
    "prose-td:px-6 prose-td:py-4 prose-td:border prose-td:border-white/10 prose-td:text-white/60",
    "prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none",
    "prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-[2rem] prose-pre:shadow-premium glass-dark",
    className
  );

  // Robust normalization for AI-generated text
  const cleanContent = (raw: string) => {
    if (!raw) return "";
    
    let text = raw.trim();

    // 1. Remove common AI conversational fluff
    text = text.replace(/^(Here is|Sure,|In this article|Today we will|This blog post).*\n/i, "");

    // 2. STRIP leading indentation (VITAL for Markdown detection)
    // Most AI outputs use 2-4 spaces which prevents `#` from being a header
    text = text.split('\n').map(line => line.trimStart()).join('\n');

    // 3. TRANSLATE HTML tags to Markdown (Hot-Swap Fix)
    // Convert <b> and <strong> to **
    text = text.replace(/<(b|strong).*?>(.*?)<\/\1>/gi, '**$2**');
    // Convert <i> and <em> to *
    text = text.replace(/<(i|em).*?>(.*?)<\/\1>/gi, '*$2*');
    // Convert <a href="...">Text</a> to [Text](URL)
    text = text.replace(/<a\s+href=["'](.*?)["'].*?>(.*?)<\/a>/gi, '[$2]($1)');

    // 4. GLOBAL DOMAIN GUARD: Ensure any stray xylos-ai.com links use the correct staging domain
    text = text.replace(/xylos-ai\.com/gi, 'xylosai.vercel.app');

    // 5. Ensure double newlines for sections if the AI only sent single ones
    // We target headers, lists, and bold text that likely starts a new context
    if (!text.includes('\n\n')) {
      text = text
        .replace(/\n(?=#{1,6}\s)/g, '\n\n') // Before headers
        .replace(/\n(?=[*+-]\s)/g, '\n\n')  // Before lists
        .replace(/\n(?=\d+\.\s)/g, '\n\n');  // Before numbered lists
    }

    // 4. Force a double newline before every header if not present
    text = text.replace(/([^\n])(\n?)(#{1,6}\s)/g, '$1\n\n$3');

    // 5. Ensure EVERY header has a space (Markdown requirement)
    text = text.replace(/\n(#{1,6})([^\s#])/g, '\n$1 $2');

    return text;
  };

  const processedContent = cleanContent(content);

  return (
    <div className={cn(proseClasses, "rich-text-output")}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
