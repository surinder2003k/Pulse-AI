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
          <div className="fixed inset-0 z-[999999] md:hidden bg-[#0A0A0A]" style={{ pointerEvents: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full w-full relative"
            >
              {/* Header inside modal */}
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo size="md" />
                </div>
                <button 
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-primary transition-colors p-2"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>

              {/* Centered Navigation Links */}
              <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-semibold text-white/90 hover:text-primary transition-colors tracking-wide"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <SignedIn>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-3 tracking-wide"
                    >
                       AI Manager <ShieldCheck className="h-6 w-6" />
                    </Link>
                  )}
                </SignedIn>
              </div>

              {/* Footer / Account options */}
              <div className="pb-12 px-8 flex justify-center w-full">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/">
                    <Button className="w-full max-w-sm h-14 bg-primary text-white rounded-xl font-bold tracking-widest text-sm hover:bg-primary/90 transition-colors shadow-lg">
                      Get Started
                    </Button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex flex-col items-center gap-4">
                    <UserButton />
                    <span className="text-sm font-medium text-white/60">{user?.fullName || "Pulse User"}</span>
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
