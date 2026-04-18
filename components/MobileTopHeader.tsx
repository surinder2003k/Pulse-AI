"use client";

import Link from "next/link";
import Logo from "./Logo";
import { UserButton } from "@clerk/nextjs";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileTopHeader() {
  const router = useRouter();

  return (
    <header className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-6 h-16 flex items-center justify-between">
      <Link href="/" className="relative z-10 scale-90 -ml-2">
        <Logo size="sm" playSoundOnHover={true} />
      </Link>

      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={() => router.push("/blog")}
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm"
        >
          <SearchIcon className="h-4 w-4 text-slate-400" />
        </button>
        <div className="p-0.5 rounded-xl border border-slate-100 bg-white shadow-sm">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
