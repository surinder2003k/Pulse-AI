"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Search, Bell, Sparkles, Menu, X, Home, BookOpen, LayoutDashboard, ShieldCheck, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { cn, ADMIN_EMAIL } from "@/lib/utils";

export default function Navbar() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

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
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
      <nav 
        className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/40 backdrop-blur-3xl"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="container mx-auto max-w-7xl h-20 flex items-center justify-between px-6 relative">
          <div className="flex items-center gap-12">
            <Link href="/" className="pointer-events-auto">
              <Logo size="md" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.slice(0, 2).map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SignedIn>
              {isAdmin && (
                <Link href="/admin" className="hidden lg:block pointer-events-auto">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-white hover:bg-primary/20 font-black uppercase tracking-widest flex items-center gap-2 border border-primary/20 rounded-full px-5 h-10">
                    <Sparkles className="h-4 w-4" /> AI Manager
                  </Button>
                </Link>
              )}
              
              <div className="hidden sm:block pointer-events-auto">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="pointer-events-auto">
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <Button size="sm" className="bg-primary text-white rounded-full px-8 h-10 hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] transition-all glow-red">
                    Get Started
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            
            <button 
              type="button"
              className="md:hidden text-white bg-white/5 hover:bg-white/10 p-3 rounded-full flex items-center justify-center transition-all border border-white/10 active:scale-90 relative z-[101] pointer-events-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[999999] md:hidden overflow-hidden" style={{ pointerEvents: 'auto' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="absolute inset-y-0 right-0 w-full bg-black/50 border-l border-white/5 flex flex-col p-8 pt-24"
            >
              <div className="flex flex-col gap-12 flex-1">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">Navigation</p>
                  <div className="h-px w-12 bg-primary/30" />
                </div>

                <div className="space-y-6">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col group py-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold uppercase tracking-tight leading-tight group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-2 text-white">
                            {link.name}
                          </span>
                          <ArrowUpRight className="h-6 w-6 text-white/20 group-hover:text-primary transition-all group-hover:rotate-45" />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 mt-1">
                          {link.name === "Home" ? "Back to base" : link.name === "Blog" ? "The heartbeat of stories" : "Intelligence center"}
                        </span>
                      </Link>
                      <div className="h-px w-full bg-white/5 mt-4" />
                    </motion.div>
                  ))}
                  
                  <SignedIn>
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between mt-6 p-6 rounded-3xl bg-primary/10 border border-primary/20 text-primary group overflow-hidden relative"
                        >
                          <div className="relative z-10">
                            <span className="text-2xl font-black uppercase tracking-widest italic leading-none">AI Manager</span>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mt-1">Authorized access only</p>
                          </div>
                          <ShieldCheck className="h-10 w-10 relative z-10 group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                      </motion.div>
                    )}
                  </SignedIn>
                </div>
              </div>

              <div className="mt-auto pb-8 space-y-6">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button className="w-full h-24 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs glow-red transition-all active:scale-95 group overflow-hidden">
                      <div className="flex items-center gap-3 relative z-10">
                        Get Started <Sparkles className="h-4 w-4 group-hover:scale-125 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                    </Button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center gap-6 p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                    <UserButton />
                    <div className="flex flex-col min-w-0 relative z-10">
                      <span className="text-xl font-black text-white truncate italic tracking-tighter leading-none">{user?.fullName || "Pulse User"}</span>
                      <span className="text-[9px] text-primary uppercase font-black tracking-widest mt-1.5 flex items-center gap-1.5">
                         <div className="h-1 w-1 rounded-full bg-primary animate-pulse" /> Pulse Verified
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </SignedIn>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between px-2">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <div className="h-1 w-1 bg-white" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <div className="h-1 w-1 bg-white" />
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Pulse AI v2.0</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
