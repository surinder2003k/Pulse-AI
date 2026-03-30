"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-12 py-8 border-t border-white/5">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="rounded-full bg-white/5 border-white/5 hover:border-primary/50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "default" : "ghost"}
            size="icon"
            onClick={() => handlePageChange(i + 1)}
            className={cn(
              "h-9 w-9 rounded-full",
              currentPage === i + 1 ? "bg-primary text-primary-foreground shadow-cyan-soft" : "text-muted-foreground hover:text-white"
            )}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="rounded-full bg-white/5 border-white/5 hover:border-primary/50 transition-colors"
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

import { cn } from "@/lib/utils";
