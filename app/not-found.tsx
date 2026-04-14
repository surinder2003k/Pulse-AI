import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Home, AlertTriangle, Cpu } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 relative overflow-hidden bg-[#030303]">
      {/* Cinematic Background Architecture */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(229,9,20,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

      {/* Neural Scan Line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-32 w-full animate-scan pointer-events-none opacity-20" />

      <div className="relative group mb-12">
        <div className="h-56 w-56 rounded-[4rem] bg-black/40 flex items-center justify-center shadow-premium border border-white/10 relative z-10 backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700 overflow-hidden">
           <AlertTriangle className="h-24 w-24 text-primary shadow-glow-red relative z-10" />
           <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        </div>
        <h1 className="text-[15rem] font-black tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] select-none italic pointer-events-none">404</h1>
      </div>
      
      <div className="flex flex-col items-center gap-10 max-w-2xl">
        <Logo size="md" />

        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
             <span className="h-[1px] w-8 bg-primary shadow-glow-red" />
             <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary italic">Protocol Divergence</span>
             <span className="h-[1px] w-8 bg-primary shadow-glow-red" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white">
            Node <span className="text-white/10 italic">Offline.</span>
          </h2>
          <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[10px] leading-relaxed border-y border-white/5 py-8 max-w-lg mx-auto">
            The intelligence grid is unable to locate the requested asset. Diagnostics suggests a <span className="text-primary font-black">CRITICAL_MISMATCH</span> within the routing protocol.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
          <Link href="/">
            <Button className="rounded-2xl h-14 px-10 bg-primary hover:glow-red-strong text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-glow-red transition-all active:scale-95 group">
              <Home className="h-4 w-4 mr-3 group-hover:-translate-y-1 transition-transform" /> 
              Return to Base
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="rounded-2xl h-14 px-10 border-white/10 hover:bg-white/5 text-white/40 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-premium transition-all group glass-dark">
              <Cpu className="h-4 w-4 mr-3 text-primary group-hover:rotate-180 transition-transform duration-700" /> 
              Re-route Matrix
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 opacity-10 flex flex-col gap-1 items-start select-none">
         <span className="text-[7px] font-mono tracking-[0.5em] text-white">ERR_PROTOCOL_404</span>
         <span className="text-[7px] font-mono tracking-[0.5em] text-white italic">SYSCALL_INITIALIZED</span>
      </div>
    </div>
  );
}
