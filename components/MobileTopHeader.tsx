"use client";

import Link from "next/link";
import Logo from "./Logo";
import { UserButton } from "@clerk/nextjs";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileTopHeader() {
  const router = useRouter();

  return (
    <header className="md:hidden sticky top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-3xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
      <Link href="/" className="relative z-10 scale-75 -ml-4">
        <Logo size="sm" />
      </Link>

      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={() => router.push("/blog")}
          className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center"
        >
          <SearchIcon className="h-4 w-4 text-white/30" />
        </button>
        <div className="p-0.5 rounded-xl border border-white/10 bg-black/40">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
