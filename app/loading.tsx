import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-10 animate-in fade-in zoom-in duration-1000">
      <div className="relative group">
        <div className="h-32 w-32 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center shadow-skeuo-button border border-white/5 animate-pulse">
           <Zap className="h-12 w-12 text-primary fill-primary animate-bounce shadow-glow-red" />
        </div>
        <div className="absolute -inset-8 blur-3xl bg-primary/20 opacity-30 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="space-y-2 text-center">
            <p className="text-xs font-black uppercase tracking-[0.6em] text-white/30">Protocol: Uplink</p>
            <p className="text-2xl font-black italic uppercase tracking-tighter text-white">
              Establishing <span className="text-primary">Intelligence</span> Link...
            </p>
        </div>
        
        <div className="h-2 w-64 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-skeuo-in relative">
           <div className="h-full bg-primary animate-progress-loading w-0 shadow-glow-red" />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
