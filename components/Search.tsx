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
      {/* Subtle Focus Glow */}
      <div className="absolute -inset-1 bg-primary/0 group-focus-within:bg-primary/5 rounded-full transition-all duration-500 pointer-events-none" />
      
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
         <SearchIcon className={cn(
           "h-5 w-5 transition-all duration-300",
           isPending ? "text-primary animate-pulse" : "text-gray-400 group-focus-within:text-primary group-focus-within:scale-110"
         )} />
      </div>
      
      <Input
        placeholder="Search stories..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-16 pl-14 pr-16 bg-white border-gray-200 focus-visible:ring-primary/20 rounded-full shadow-sm font-semibold tracking-wider text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:border-primary/30"
      />
      
      {/* Right Side Loading */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
        {isPending && (
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        )}
      </div>
    </div>
  );
}
