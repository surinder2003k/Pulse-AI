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
                "px-6 py-2.5 cursor-pointer rounded-full transition-all duration-300 font-bold uppercase tracking-widest text-xs border",
                isActive 
                  ? "bg-primary text-white border-primary shadow-sm scale-105" 
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
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
