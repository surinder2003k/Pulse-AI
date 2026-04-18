import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="relative">
        {/* Simple Pulse Effect */}
        <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        
        {/* Centered Logo or Icon */}
        <div className="relative flex flex-col items-center gap-4">
          <Zap className="h-12 w-12 text-primary fill-primary animate-bounce" />
          <h2 className="text-xl font-bold tracking-tighter text-gray-900 italic">
            PULSE <span className="text-primary">AI</span>
          </h2>
        </div>
      </div>
      
      {/* Discreet progress hint */}
      <div className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-loading w-full origin-left" />
      </div>
    </div>
  );
}
