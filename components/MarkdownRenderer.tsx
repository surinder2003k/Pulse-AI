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
  return /<\/?(?:p|div|h[1-6]|ul|ol|li|article|section|blockquote)[\s>]/i.test(content);
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const proseClasses = cn(
    "prose prose-slate max-w-none prose-invert font-inter", // Use prose-invert for dark or prose-prose for light? Actually, site is light-ish with dark text?
    "prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-gray-900",
    "prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:leading-none prose-h1:mb-12",
    "prose-h2:text-2xl md:prose-h2:text-4xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:border-l-[6px] prose-h2:border-primary prose-h2:pl-8",
    "prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6",
    "prose-p:text-lg md:prose-p:text-xl prose-p:leading-[1.8] prose-p:text-gray-600 prose-p:mb-10 prose-p:font-medium",
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-black transition-all",
    "prose-ul:my-10 prose-ul:list-disc prose-li:text-gray-600 prose-li:leading-relaxed prose-li:mb-4 prose-li:pl-2",
    "prose-img:rounded-[3rem] prose-img:shadow-premium prose-img:my-16 prose-img:border prose-img:border-gray-100",
    "prose-blockquote:border-l-primary prose-blockquote:bg-slate-50 prose-blockquote:py-10 prose-blockquote:px-12 prose-blockquote:rounded-[2.5rem] prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-16 prose-blockquote:border-y prose-blockquote:border-r prose-blockquote:border-gray-100",
    "prose-strong:text-gray-900 prose-strong:font-black",
    "prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md",
    "prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-100 prose-pre:rounded-3xl prose-pre:shadow-sm",
    "px-4 md:px-0", // Mobile padding
    className
  );

  const cleanContent = (raw: string) => {
    if (!raw) return "";
    let text = raw.trim();

    // 1. Remove common AI conversational fluff
    text = text.replace(/^(Here is|Sure,|In this article|Today we will|This blog post).*\n/i, "");

    // 2. Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // 3. Hot-Swap common HTML tags to Markdown for compatible rendering
    text = text.replace(/<(b|strong).*?>(.*?)<\/\1>/gi, '**$2**');
    text = text.replace(/<(i|em).*?>(.*?)<\/\1>/gi, '*$2*');
    text = text.replace(/<a\s+href=["'](.*?)["'].*?>(.*?)<\/a>/gi, '[$2]($1)');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<p.*?>(.*?)<\/p>/gi, '$1\n\n');
    text = text.replace(/<h([1-6]).*?>(.*?)<\/h\1>/gi, (match, level, content) => {
      return '\n' + '#'.repeat(level) + ' ' + content + '\n';
    });

    // 4. Resolve "Stuck" formatting: Case where AI says **Title** on its own line
    // Ensure headings have proper newlines
    text = text.replace(/([^\n])(\n?)(#{1,6}\s)/g, '$1\n\n$3');
    
    // 5. Special Fix for Bold titles that should be headers
    // If a line starts and ends with ** and has no punctuation at the end, make it an H3
    text = text.replace(/^(\*\*)([^\n\*]+)(\*\*)$/gm, '### $2');

    return text;
  };

  const processedContent = cleanContent(content);

  return (
    <div className={proseClasses}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
