import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="relative group">
        <div className="h-48 w-48 rounded-[3.5rem] bg-secondary/10 flex items-center justify-center shadow-skeuo-button border border-white/5 relative z-10">
           <AlertTriangle className="h-20 w-20 text-primary drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
        </div>
        <h1 className="text-[12rem] font-black tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] select-none italic">404</h1>
      </div>
      
      <div className="space-y-6 max-w-xl">
        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
          Sequence <span className="text-primary italic">Broken</span>
        </h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs leading-relaxed border-y border-white/5 py-6">
          The intelligence grid is unable to locate the requested node. The asset may have been purged or the uplink was misconfigured. 
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/">
          <Button className="rounded-[2rem] h-16 px-10 bg-primary hover:glow-red-strong text-white font-black uppercase tracking-widest text-[10px] shadow-skeuo-float transition-all active:scale-95">
            <Home className="h-4 w-4 mr-3" /> Return to Base
          </Button>
        </Link>
        <Link href="/blog">
          <Button variant="outline" className="rounded-[2rem] h-16 px-10 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest text-[10px] shadow-skeuo-button transition-all">
            <Terminal className="h-4 w-4 mr-3 text-primary" /> Access Archive
          </Button>
        </Link>
      </div>
    </div>
  );
}
