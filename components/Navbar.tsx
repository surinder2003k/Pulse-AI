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
    <>
      <nav 
        className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/80 backdrop-blur-xl"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="container mx-auto max-w-7xl h-16 flex items-center justify-between px-6 relative">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group pointer-events-auto">
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
              <Link href="/dashboard" className="hidden sm:block pointer-events-auto">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5">
                  Dashboard
                </Button>
              </Link>
              <div className="pointer-events-auto">
                <UserButton fallbackRedirectUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="pointer-events-auto">
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <Button size="sm" className="bg-primary text-white rounded-lg px-6 hover:bg-primary/90 font-bold transition-all shadow-purple text-xs">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            
            {/* Extremely simple button to avoid any shadcn/framer-motion wrapper issues */}
            <button 
              type="button"
              className="md:hidden text-white hover:bg-white/10 p-2 rounded-xl flex items-center justify-center transition-all bg-white/5 border border-white/10 active:scale-90 relative z-[101] pointer-events-auto"
              onClick={() => {
                console.log("MOBILE MENU CLICKED - STATE CHANGING");
                setIsMobileMenuOpen(true);
              }}
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Moved to HIGHEST possible level */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[999999] md:hidden overflow-hidden" style={{ pointerEvents: 'auto' }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 400, mass: 0.5 }}
              className="absolute inset-y-0 right-0 w-[85%] max-w-[320px] bg-black border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 flex flex-col pt-20"
            >
              {/* Close Button Inside Drawer */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full h-12 w-12 flex items-center justify-center transition-all border border-white/10 bg-white/5 active:scale-95"
                aria-label="Close menu"
              >
                <X className="h-7 w-7" />
              </button>

              <div className="flex flex-col gap-5 flex-1 mt-4">
                <p className="px-5 text-[11px] font-black uppercase tracking-[0.3em] text-primary/80 mb-2">Platform</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 hover:bg-white/10 transition-all text-xl font-black italic group border border-white/[0.03] active:bg-white/20"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-secondary/80 flex items-center justify-center group-hover:bg-primary transition-all border border-white/5 shadow-inner">
                      <link.icon className="h-6 w-6 text-white" />
                    </div>
                    {link.name}
                  </Link>
                ))}
                
                <SignedIn>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-5 p-5 rounded-3xl bg-primary/10 hover:bg-primary/20 transition-all text-xl font-black italic border border-primary/20 text-primary group mt-2"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(168,85,247,0.5)]">
                      <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    Dashboard
                  </Link>
                </SignedIn>
              </div>

              <div className="mt-auto pb-10">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button className="w-full h-20 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.25em] text-xs shadow-[0_15px_35px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-white">
                      Sign In Now
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-5 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-inner">
                    <UserButton fallbackRedirectUrl="/" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-black text-white truncate italic tracking-tight">{user?.fullName || "Pulse AI User"}</span>
                      <span className="text-[10px] text-primary uppercase font-black tracking-widest mt-0.5">Verified Profile</span>
                    </div>
                  </div>
                </SignedIn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
