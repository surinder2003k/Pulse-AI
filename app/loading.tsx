import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-6 animate-in fade-in duration-1000">
      <div className="relative">
        <Sparkles className="h-12 w-12 text-primary animate-pulse" />
        <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xl font-black italic uppercase tracking-widest text-white">
          Brewing Passion...
        </p>
        <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-progress-loading w-0" />
        </div>
      </div>
    </div>
  );
}
