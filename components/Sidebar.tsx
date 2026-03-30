"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  LayoutDashboard, 
  PlusCircle, 
  ShieldCheck,
  BrainCircuit,
  Zap,
  Layout,
  FileText,
  User,
  TrendingUp,
  Settings,
  ArrowLeft
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
    <aside className="hidden md:flex flex-col w-72 bg-black border-r border-white/5 h-screen sticky top-0 z-50">
      <div className="p-10">
        <Link href="/" className="block">
          <Logo size="md" />
        </Link>
      </div>

      <div className="flex-1 px-6 space-y-12 mt-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Terminal</p>
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                pathname === item.href 
                  ? "bg-primary text-white font-black shadow-2xl scale-[1.02]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors")} />
              <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
              {pathname === item.href && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary -z-10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <p className="px-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Management</p>
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group",
                  pathname.startsWith(item.href) 
                    ? "bg-primary/10 text-primary border border-primary/20 font-black shadow-lg" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 mt-auto">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-4 rounded-2xl h-14 hover:bg-white/5 text-muted-foreground hover:text-white group border border-transparent hover:border-white/10">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Exit Terminal</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
