"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "India News",
  "Technology",
  "Business",
  "Science",
  "Global",
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className="focus:outline-none"
        >
          <Badge
            variant={activeCategory === cat ? "default" : "secondary"}
            className={cn(
              "px-4 py-1.5 cursor-pointer rounded-full transition-all duration-300",
              activeCategory === cat 
                ? "bg-primary text-white scale-105 shadow-purple" 
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
            )}
          >
            {cat}
          </Badge>
        </button>
      ))}
    </div>
  );
}
