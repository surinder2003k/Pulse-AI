import { PostContentSkeleton } from "@/components/LoadingSkeleton";
import { ChevronLeft } from "lucide-react";

export default function PostLoading() {
  return (
    <div className="bg-white min-h-screen text-gray-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 opacity-50" />
      
      <div className="max-w-4xl mx-auto pb-40 pt-32 px-6 relative z-10">
        <div className="inline-flex items-center gap-3 text-gray-300 transition-all mb-16 font-bold uppercase tracking-widest text-xs shadow-sm bg-gray-50 px-8 py-3 rounded-full border border-gray-100 animate-pulse cursor-default">
           <ChevronLeft className="h-4 w-4" /> Back to Articles
        </div>

        <PostContentSkeleton />
      </div>
    </div>
  );
}
