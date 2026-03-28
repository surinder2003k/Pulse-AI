"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Search, Bell, Sparkles, Menu, X, Home, BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Blog", href: "/blog", icon: BookOpen },
  ];

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
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                Dashboard
              </Button>
            </Link>
            <UserButton fallbackRedirectUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <Button size="sm" className="bg-primary text-white rounded-lg px-6 hover:bg-primary/90 font-bold transition-all shadow-purple text-xs">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-white/10 flex items-center justify-center"
            onClick={() => {
              console.log("Mobile menu trigger clicked");
              setIsMobileMenuOpen(true);
            }}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Outside the main nav content for better stacking */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-[300px] bg-[#0A0A0A] border-l border-white/10 shadow-2xl p-6 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <Image src="/logo.svg" alt="Pulse AI" width={110} height={36} className="h-8 w-auto" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-lg font-black italic group border border-white/5"
                  >
                    <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                      <link.icon className="h-5 w-5 text-white" />
                    </div>
                    {link.name}
                  </Link>
                ))}
                
                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all text-lg font-black italic border border-primary/30 text-primary group mt-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                    </div>
                    Dashboard
                  </Link>
                </SignedIn>
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.15em] text-xs shadow-purple active:scale-95 transition-transform">
                      Get Started
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                    <UserButton fallbackRedirectUrl="/" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-black text-white truncate italic">{user?.fullName || "User"}</span>
                      <span className="text-[10px] text-primary uppercase font-black tracking-widest">Premium Member</span>
                    </div>
                  </div>
                </SignedIn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
