"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const categories = [
  "All",
  "India News",
  "Technology",
  "Business",
  "Science",
  "Global",
];

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  return (
    <nav className="flex flex-wrap gap-3 px-1" aria-label="Category Filter">
      {categories.map((cat) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat === "All") {
          params.delete("category");
        } else {
          params.set("category", cat);
        }
        const href = `/blog${params.toString() ? `?${params.toString()}` : ""}`;
        const isActive = activeCategory === cat;

        return (
          <Link
            key={cat}
            href={href}
            className="focus:outline-none"
          >
            <Badge
              className={cn(
                "px-6 py-2.5 cursor-pointer rounded-full transition-all duration-500 font-black uppercase tracking-widest text-[10px] border",
                isActive 
                  ? "bg-primary text-white border-primary glow-red shadow-skeuo-button scale-105" 
                  : "bg-secondary/10 text-white/30 border-white/5 hover:bg-white/5 hover:text-white hover:border-white/10 shadow-skeuo-in"
              )}
            >
              {cat}
            </Badge>
          </Link>
        );
      })}
    </nav>
  );
}
