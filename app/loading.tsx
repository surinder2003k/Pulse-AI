import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-16 animate-in fade-in duration-1000 bg-[#030303] overflow-hidden">
      {/* Cinematic Architecture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(229,9,20,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      {/* Tactical Telemetry Corners */}
      <div className="absolute top-10 left-10 text-[9px] font-mono text-white/10 uppercase tracking-[0.4em] select-none">
         <div className="flex items-center gap-3">
            <span className="h-1 w-1 bg-primary rounded-full animate-ping" />
            Uplink: Synchronizing
         </div>
         <div className="mt-2 opacity-30">HEX: 0x4F 0x52 0x41 0x43 0x4C 0x45</div>
      </div>
      
      <div className="absolute bottom-10 right-10 text-[9px] font-mono text-white/10 uppercase tracking-[0.4em] text-right select-none">
         <div className="opacity-30 mb-2">COORD: 34.0522° N, 118.2437° W</div>
         <div className="flex items-center justify-end gap-3">
            Bit-Rate: 14.2 GB/S
            <span className="h-1 w-1 bg-primary rounded-full animate-pulse" />
         </div>
      </div>

      <div className="relative group">
        {/* Cinematic Depth Rings */}
        <div className="absolute -inset-10 rounded-full border border-primary/5 animate-spin-slow opacity-20" />
        <div className="absolute -inset-20 rounded-full border border-primary/5 animate-reverse-spin-slow opacity-10" />
        
        <div className="h-48 w-48 rounded-[4rem] bg-black/60 backdrop-blur-3xl flex items-center justify-center shadow-premium border border-white/5 relative z-10 overflow-hidden">
           {/* Laser Scanner Effect */}
           <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-glow-red animate-scan z-20" />
           <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <Zap className="h-20 w-20 text-primary fill-primary shadow-glow-red relative z-10" />
        </div>
        
        {/* Core Volumetric Glow */}
        <div className="absolute -inset-16 blur-[120px] bg-primary/20 opacity-40 animate-pulse pointer-events-none" />
      </div>
      
      <div className="flex flex-col items-center gap-10 relative z-10">
        <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="h-[1px] w-12 bg-primary/20" />
              <p className="text-[11px] font-black uppercase tracking-[0.8em] text-primary italic">Neural Link</p>
              <span className="h-[1px] w-12 bg-primary/20" />
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
              Initializing <span className="text-glow-red">Core</span>
            </h2>
            <div className="flex items-center justify-center gap-2 opacity-30">
               <span className="text-[10px] font-mono uppercase tracking-[0.5em]">Auth: Standard-Bypass</span>
               <div className="h-3 w-[1px] bg-white/20" />
               <span className="text-[10px] font-mono uppercase tracking-[0.5em]">Ver: 2024.X</span>
            </div>
        </div>
        
        <div className="relative group/bar">
          <div className="h-2 w-96 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-premium">
             <div className="h-full bg-primary animate-progress-loading shadow-glow-red rounded-full" />
          </div>
          
          {/* Tactical Gradient Underlay */}
          <div className="absolute -bottom-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        <div className="flex gap-16 mt-6 italic font-mono text-[10px] uppercase tracking-[0.4em] text-white/10">
           {["Encrypting", "Relaying", "Optimizing"].map((step, i) => (
             <div key={step} className="flex items-center gap-3 group">
               <span className={cn(
                 "w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse",
                 i === 1 && "[animation-delay:200ms]",
                 i === 2 && "[animation-delay:400ms]"
               )} />
               <span className="group-hover:text-primary/40 transition-colors">{step}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
