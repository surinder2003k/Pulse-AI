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
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="absolute inset-y-0 right-0 w-full bg-black flex flex-col p-8 pt-24"
            >
              <div className="flex flex-col gap-8 flex-1">
                <div className="mb-12">
                  <Logo size="lg" />
                </div>

                <div className="space-y-4">
                  <p className="px-1 text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-6">Navigation</p>
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="border-b border-white/5 pb-2"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between group py-4 h-full"
                      >
                        <span className="text-[12vw] font-black uppercase tracking-tighter italic leading-none group-hover:text-primary transition-colors">
                          {link.name}
                        </span>
                        <ArrowUpRight className="h-8 w-8 text-white/20 group-hover:text-primary transition-all group-hover:rotate-45" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <SignedIn>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-8 flex items-center justify-between p-6 rounded-3xl bg-primary/10 border border-primary/20 text-primary"
                    >
                      <span className="text-2xl font-black uppercase tracking-widest italic">AI Manager</span>
                      <ShieldCheck className="h-8 w-8" />
                    </Link>
                  )}
                </SignedIn>
              </div>

              <div className="mt-auto pb-8 flex flex-col gap-4">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button className="w-full h-20 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm glow-red">
                      Get Full Access
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/10">
                    <UserButton />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xl font-black text-white truncate italic tracking-tighter">{user?.fullName || "Pulse User"}</span>
                      <span className="text-[10px] text-primary uppercase font-black tracking-widest mt-0.5">Verified Intelligence</span>
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
