"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  PlusCircle, 
  ShieldCheck,
  FileText,
  ArrowLeft,
  LayoutDashboard,
  Zap,
  Globe
} from "lucide-react";
import { cn, ADMIN_EMAIL } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

const primaryNav = [
  { name: "Overview", icon: Home, href: "/dashboard" },
  { name: "All Stories", icon: FileText, href: "/dashboard/posts" },
  { name: "Create New", icon: PlusCircle, href: "/dashboard/create" },
];

const adminNav = [
  { name: "AI Manager", icon: ShieldCheck, href: "/admin" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <aside className="hidden md:flex flex-col w-72 bg-[#030303] border-r border-white/5 h-screen sticky top-0 z-50 overflow-hidden glass-dark relative">
      {/* Cinematic Background Architecture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(229,9,20,0.03),transparent_40%)] pointer-events-none -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none -z-10" />

      <div className="p-10 pb-16 flex flex-col gap-2">
        <Link href="/" className="block">
          <Logo size="md" />
        </Link>
        <span className="text-[7px] font-mono text-white/10 uppercase tracking-[0.5em] ml-2">Secure Uplink // {user?.id?.slice(-8).toUpperCase() || "GUEST"}</span>
      </div>

      <div className="flex-1 px-6 space-y-12 overflow-y-auto custom-scrollbar relative z-10">
        <div className="space-y-3">
          <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow-red" />
            Core Protocol
          </p>
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                  isActive 
                    ? "text-white font-black" 
                    : "text-white/20 hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 rotate-0 group-hover:rotate-12 transition-transform duration-500", isActive ? "text-primary drop-shadow-glow" : "text-white/10 group-hover:text-primary")} />
                <span className="text-[12px] font-black uppercase tracking-[0.15em] leading-none italic">{item.name}</span>
                
                {isActive && (
                  <>
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/[0.03] border border-white/5 -z-10 shadow-premium"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    />
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-primary shadow-glow-red rounded-full" />
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <div className="space-y-3">
            <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
               <Zap className="h-3.5 w-3.5 text-primary group-hover:animate-pulse" />
               Management
            </p>
            {adminNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                    isActive 
                      ? "text-primary font-black bg-primary/5 border border-primary/20 shadow-glow-red" 
                      : "text-white/20 hover:bg-white/[0.03] hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary shadow-glow-red transition-all" : "text-white/10 group-hover:text-primary")} />
                  <span className="text-[12px] font-black uppercase tracking-[0.15em] leading-none italic">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* System Telemetry Footer */}
      <div className="px-10 py-8 border-t border-white/5 bg-black/40">
         <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">Synthesis Rate</span>
                 <span className="text-[9px] font-black text-primary drop-shadow-glow">98.4%</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "98.4%" }}
                   transition={{ duration: 2, delay: 0.5 }}
                   className="h-full bg-primary shadow-glow-red" 
                 />
              </div>
            </div>
            <div className="flex justify-between items-center opacity-40">
               <span className="text-[7px] font-mono uppercase tracking-widest">Protocol: V4.0.2</span>
               <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="w-1 h-1 rounded-full bg-white/20" />
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-4 rounded-xl h-14 hover:bg-primary/10 text-white/40 hover:text-primary group border border-white/5 hover:border-primary/20 shadow-premium transition-all duration-500">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform duration-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">Exit Terminal</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
