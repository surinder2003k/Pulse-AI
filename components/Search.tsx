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
      {/* Cinematic Focus Glow */}
      <div className="absolute -inset-1 bg-primary/0 group-focus-within:bg-primary/5 rounded-[2rem] blur-2xl transition-all duration-700 pointer-events-none" />
      
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
         <SearchIcon className={cn(
           "h-5 w-5 transition-all duration-500",
           isPending ? "text-primary animate-pulse shadow-glow-red" : "text-white/10 group-focus-within:text-primary group-focus-within:scale-110 group-focus-within:drop-shadow-glow"
         )} />
      </div>
      
      <Input
        placeholder="TERMINAL QUERY / SEARCH..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-20 pl-16 pr-16 bg-black/40 border-white/5 focus-visible:ring-primary/20 rounded-[2rem] shadow-premium font-black uppercase tracking-[0.5em] text-[11px] text-white placeholder:text-white/5 transition-all duration-500 focus:border-primary/20 glass-dark"
      />
      
      {/* Right Side Telemetry */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4">
        {isPending ? (
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        ) : (
          <div className="flex flex-col items-end opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 select-none">
             <span className="text-[8px] font-black text-primary italic tracking-widest uppercase">Protocol: Active</span>
             <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.2em]">Layer // 01</span>
          </div>
        )}
      </div>
      
      {/* Tactical Scanning Line (Focus Only) */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-primary/40 shadow-glow-red opacity-0 group-focus-within:opacity-100 group-focus-within:animate-scan transition-opacity pointer-events-none" />
    </div>
  );
}
