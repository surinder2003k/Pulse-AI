import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-20 p-4 md:p-6 w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 md:w-80 rounded-xl" />
          <div className="flex items-center gap-2">
             <div className="w-6 h-[2px] bg-gray-200" />
             <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6 space-y-4">
         <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-32 rounded-lg" />
         </div>
         <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
               <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
         </div>
      </div>
    </div>
  );
}
