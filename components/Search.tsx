"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
         <SearchIcon className={cn(
           "h-4 w-4 transition-all duration-300",
           isPending ? "text-primary animate-pulse" : "text-white/20 group-focus-within:text-primary group-focus-within:scale-110"
         )} />
      </div>
      
      <Input
        placeholder="TERMINAL QUERY / SEARCH..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-16 pl-14 pr-14 bg-black/40 border-white/5 focus-visible:ring-primary/20 rounded-[1.5rem] shadow-skeuo-in font-black uppercase tracking-[0.4em] text-[10px] text-white placeholder:text-white/10 transition-all focus:border-primary/20"
      />
      
      {isPending && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        </div>
      )}
      
      {/* Inner Highlight Reflection */}
      <div className="absolute inset-0 border border-white/5 rounded-[1.5rem] pointer-events-none group-focus-within:border-primary/10 transition-colors" />
    </div>
  );
}
