"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const proseClasses = cn(
    "prose prose-slate max-w-none font-inter", 
    "prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight", // Removed uppercase and tracking-tighter
    "prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-12",
    "prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-none prose-h2:pl-0", // Removed border and padding
    "prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4",
    "prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:text-slate-600 prose-p:mb-8", // Changed leading and removed font-medium for cleaner look
    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-semibold transition-all",
    "prose-ul:my-8 prose-ul:list-disc prose-li:text-slate-600 prose-li:leading-relaxed prose-li:mb-2",
    "prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-12 prose-img:border prose-img:border-slate-100 prose-img:mx-auto prose-img:block prose-img:w-full", // Combined block and full-width to fix alignment
    "prose-blockquote:border-l-primary/30 prose-blockquote:bg-slate-50/50 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-2xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:my-12",
    "prose-strong:text-slate-900 prose-strong:font-bold", // Softened from font-black
    "prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md",
    "prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-100 prose-pre:rounded-2xl prose-pre:shadow-sm",
    "px-4 md:px-0",
    className
  );

  const cleanContent = (raw: string) => {
    if (!raw) return "";
    
    // 0. Deep Sanitization: Remove zero-width characters and common entities that break Markdown
    let text = raw.trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/&nbsp;/g, " ");

    // 1. Remove common AI conversational fluff
    text = text.replace(/^(Here is|Sure,|In this article|Today we will|This blog post).*\n/i, "");

    // 2. Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // 3. Hot-Swap common HTML tags to Markdown for compatible rendering
    // Convert HTML images to Markdown bridge
    text = text.replace(/<img\s+[^>]*?src=["'](.*?)["'][^>]*?alt=["'](.*?)["'].*?>/gi, (match, src, alt) => {
        return `\n![${alt}](${src.replace(/&amp;/g, '&')})\n`;
    });
    text = text.replace(/<img\s+[^>]*?alt=["'](.*?)["'][^>]*?src=["'](.*?)["'].*?>/gi, (match, alt, src) => {
        return `\n![${alt}](${src.replace(/&amp;/g, '&')})\n`;
    });
    
    text = text.replace(/<(b|strong).*?>(.*?)<\/\1>/gi, '**$2**');
    text = text.replace(/<(i|em).*?>(.*?)<\/\1>/gi, '*$2*');
    text = text.replace(/<a\s+href=["'](.*?)["'].*?>(.*?)<\/a>/gi, '[$2]($1)');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<p.*?>(.*?)<\/p>/gi, '$1\n\n');
    text = text.replace(/<h([1-6]).*?>(.*?)<\/h\1>/gi, (match, level, content) => {
      return '\n' + '#'.repeat(level) + ' ' + content + '\n';
    });

    // 3.5 Strip internal AI metadata labels (e.g., "Asset 01 // Narrative Context")
    text = text.replace(/^\s*Asset \d+ \/\/ .*$/gm, '');
    text = text.replace(/\[Asset \d+\]/g, '');

    // 4. Resolve "Stuck" formatting: Heading detection
    // Ensure headings have proper newlines before them
    text = text.replace(/([^\n])(\n?)(#{1,6}\s)/g, '$1\n\n$3');
    
    // 5. HARDENED: Headers merged with paragraph text on same line
    // Now even more aggressive to catch any character after a header
    text = text.replace(/^\s*(#{1,6})\s*([^\n#\n]+?)\s+([^\n]+)$/gm, '$1 $2\n\n$3');

    // 6. HARDENED: Bold headers that are followed by the paragraph text
    // Example: "** Introduction ** Having a blog..." -> "### Introduction\n\nHaving a blog..."
    // This regex catches bold text at the start of a line and pulls the rest of the line down
    text = text.replace(/^\s*(\*\*)([^\n\*:]+)(\*\*)\s*(:?)\s*(.*)$/gm, (match, b1, title, b2, colon, rest) => {
       if (rest.trim()) {
           return `### ${title.trim()}\n\n${rest.trim()}`;
       }
       return `### ${title.trim()}`;
    });

    // 7. HARDENED: Numbered list style headers (e.g. "1/ Introduction" or "1. Introduction")
    // If it's a short line starting with a number and slash/dot, it's likely a title
    text = text.replace(/^\s*(\d+\s*[\/\.]\s*)([A-Z][^\n]{3,40})$/gm, '### $2');

    // 8. Ensure double newlines for paragraphs (ReactMarkdown requirement)
    // Convert single newlines that aren't parts of lists or headers into double newlines
    text = text.replace(/([^\n])\n([^\n#\-*>\d])/g, '$1\n\n$2');

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
