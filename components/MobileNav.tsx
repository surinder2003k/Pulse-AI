"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, PlusCircle, Zap, ShieldCheck } from "lucide-react";
import { cn, ADMIN_EMAIL } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

const primaryNav = [
  { name: "Overview", icon: Home, href: "/dashboard" },
  { name: "Stories", icon: FileText, href: "/dashboard/posts" },
  { name: "Create", icon: PlusCircle, href: "/dashboard/create" },
];

const adminNavItem = { name: "AI", icon: ShieldCheck, href: "/admin" };

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const navItems = isAdmin ? [...primaryNav, adminNavItem] : primaryNav;

  return (
    <nav className="md:hidden fixed bottom-10 left-6 right-6 z-50 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-premium overflow-hidden glass-dark pb-safe">
      {/* Cinematic Pulse Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="flex items-center justify-around h-20 relative z-10">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-500 relative px-4",
                isActive ? "text-primary scale-110" : "text-white/20 hover:text-white/50"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="mobile-nav-active"
                  className="absolute -top-1 w-6 h-[2px] bg-primary shadow-glow-red rounded-full"
                />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-all duration-500",
                  isActive ? "drop-shadow-glow" : ""
                )}
              />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] italic">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
