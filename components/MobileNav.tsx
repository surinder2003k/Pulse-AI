"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, PlusCircle, Zap, ShieldCheck } from "lucide-react";
import { cn, ADMIN_EMAIL } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.8)]">
      <div className="flex items-stretch h-16">
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
                "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative",
                isActive ? "text-primary" : "text-white/30 hover:text-white/70"
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,51,51,0.8)]" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive ? "scale-110" : ""
                )}
              />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
