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
    <aside className="hidden md:flex flex-col w-72 bg-black border-r border-white/5 h-screen sticky top-0 z-50 overflow-hidden">
      <div className="p-10 pb-16">
        <Link href="/" className="block">
          <Logo size="md" />
        </Link>
      </div>

      <div className="flex-1 px-6 space-y-12 overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Terminal
          </p>
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "text-white font-black" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 rotate-0 group-hover:rotate-12 transition-transform", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary -z-10 shadow-skeuo-button"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <div className="space-y-3">
            <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
               <Zap className="h-3 w-3" />
               Management
            </p>
            {adminNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isActive 
                      ? "text-primary font-black border border-primary/20 bg-primary/5 shadow-skeuo-in" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                  <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-6 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-4 rounded-2xl h-14 hover:bg-white/5 text-muted-foreground hover:text-white group border border-transparent hover:border-white/10 shadow-skeuo-button active:shadow-skeuo-button-pressed">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Exit Terminal</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
