import { cn } from "@/lib/utils";
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
    <div className="flex items-center justify-center gap-4 mt-12 py-8 border-t border-gray-100">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="rounded-full bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>
      
      <div className="flex items-center gap-1 md:gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          // Only show first, last, current, and pages around current
          if (
            totalPages > 7 && 
            page !== 1 && 
            page !== totalPages && 
            Math.abs(page - currentPage) > 1
          ) {
            if (Math.abs(page - currentPage) === 2) {
              return <span key={page} className="text-gray-300 px-1">...</span>;
            }
            return null;
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon"
              onClick={() => handlePageChange(page)}
              className={cn(
                "h-8 w-8 md:h-10 md:w-10 rounded-xl font-bold text-[10px] md:text-xs transition-all",
                currentPage === page 
                  ? "bg-primary text-white shadow-premium glow-red border-none scale-105" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="rounded-full bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

import { cn } from "@/lib/utils";
