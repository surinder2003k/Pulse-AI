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
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { name: "Overview", icon: Home, href: "/dashboard" },
  { name: "All Posts", icon: FileText, href: "/dashboard/posts" },
  { name: "Create Post", icon: PlusCircle, href: "/dashboard/create" },
];

const adminNav = [
  { name: "AI Post Manager", icon: ShieldCheck, href: "/admin" },
];

import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "xyzg135@gmail.com";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-secondary/30 border-r border-white/5 h-screen sticky top-0">
      <div className="p-8">
        <Link href="/" className="group block">
          <Image 
            src="/logo.svg" 
            alt="Pulse AI Logo" 
            width={140} 
            height={46} 
            className="h-9 w-auto group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">AI Dashboard</p>
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                pathname === item.href 
                  ? "bg-primary/20 text-primary font-bold shadow-sm" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Administration</p>
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  pathname.startsWith(item.href) 
                    ? "bg-primary/20 text-primary font-bold shadow-sm" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 mt-auto">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white group">
            <Home className="h-5 w-5 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Back to Site</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
