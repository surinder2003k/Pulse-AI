"use client";

import Link from "next/link";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Search, Bell, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from "next/image";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.svg" 
              alt="Pulse AI Logo" 
              width={120} 
              height={40} 
              className="h-8 w-auto transition-all duration-300"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Blog</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" className="bg-primary text-white rounded-lg px-6 hover:bg-primary/90 font-bold transition-all shadow-purple">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
