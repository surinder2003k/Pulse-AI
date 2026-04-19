import { PostGridSkeleton } from "@/components/LoadingSkeleton";
import { Database } from "lucide-react";

export default function BlogLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      <div className="flex flex-col gap-10 md:gap-14 pb-24 pt-16 px-4 md:px-6 container mx-auto">
        {/* Header Section Skeleton */}
        <div className="flex flex-col items-center text-center gap-4 relative">
           <div className="flex items-center gap-3 bg-gray-50 px-5 py-2 rounded-full border border-gray-100 animate-pulse">
              <Database className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Syncing Matrix...</span>
           </div>
           <div className="h-12 w-64 bg-gray-100 rounded-2xl animate-pulse" />
           <div className="h-4 w-48 bg-gray-50 rounded-full animate-pulse" />
        </div>

        {/* Stories Grid Skeleton */}
        <PostGridSkeleton />
      </div>
    </div>
  );
}
