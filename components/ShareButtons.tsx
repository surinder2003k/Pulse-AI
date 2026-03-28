"use client";

import { Twitter, Link as LinkIcon, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this amazing article: ${title}`,
          url: url,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Error sharing:", error);
          toast.error("Could not complete share.");
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:text-green-500",
    },
    {
      name: "X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:text-sky-400",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleNativeShare}
        variant="outline"
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white rounded-full px-6 py-2 flex items-center gap-2 shadow-skeuo-button transition-all font-black uppercase tracking-widest text-[10px]"
      >
        <Share2 className="h-4 w-4" /> Share Now
      </Button>

      <div className="h-6 w-px bg-white/10 mx-2" />

      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="icon"
          className={cn("h-9 w-9 bg-white/5 border-white/5 rounded-full transition-colors", link.color)}
          asChild
        >
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            <link.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 bg-white/5 border-white/5 rounded-full hover:text-primary transition-colors"
        onClick={copyToClipboard}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Fixed import for cn in ShareButtons
import { cn } from "@/lib/utils";
