"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, PenSquare, Menu, X, Zap, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import { cn, ADMIN_EMAIL } from "@/lib/utils";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const navLinks = [
    { name: "Intelligence", href: "/blog" },
    { name: "Archive", href: "/blog?category=All" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
      isScrolled ? "py-3 px-6 md:px-10" : "py-6 px-6 md:px-10"
    )}>
      <div className="container mx-auto">
        <div className={cn(
          "relative flex items-center justify-between p-4 px-6 md:px-10 rounded-[2rem] transition-all duration-1000 overflow-hidden",
          isScrolled 
            ? "bg-black/60 backdrop-blur-3xl shadow-skeuo-float border-white/10 border scale-[1.01]" 
            : "bg-transparent border-transparent"
        )}>
          {/* Inner Light reflection effect for scrolled state */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none" 
              />
            )}
          </AnimatePresence>

          {/* Logo Section */}
          <Link href="/" className="relative z-50 group">
            <Logo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-[9px] font-black uppercase tracking-[0.4em] transition-all relative group py-2",
                      isActive ? "text-primary italic" : "text-white/30 hover:text-white"
                    )}
                  >
                    {link.name}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-[1.5px] bg-primary transition-all duration-500 rounded-full",
                      isActive ? "w-full shadow-[0_0_10px_rgba(255,51,51,0.5)]" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                );
              })}
            </div>

            <div className="h-6 w-[1px] bg-white/10" />

            <div className="flex items-center gap-6">
              {isSignedIn ? (
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all group">
                    <LayoutDashboard className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                    Terminal
                  </Link>
                  {isAdmin && (
                    <Link href="/dashboard/create" className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:text-glow-red transition-all group">
                      <Zap className="w-3.5 h-3.5 fill-primary group-hover:scale-110 transition-transform" />
                      Initiate
                    </Link>
                  )}
                  <div className="p-1 rounded-[12px] border border-white/10 bg-secondary/20 shadow-skeuo-button hover:shadow-skeuo-button-pressed transition-all">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <SignInButton mode="modal">
                    <button className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">
                      Access Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-primary hover:glow-red-strong text-white text-[9px] font-black uppercase tracking-[0.4em] px-6 py-3 rounded-[1.2rem] transition-all flex items-center gap-2.5 group shadow-skeuo-float hover:scale-[1.02] active:scale-95">
                      Join Network <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden relative z-50 p-2.5 rounded-xl bg-secondary/10 border border-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all shadow-skeuo-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 lg:hidden bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-10"
          >
             {/* Decorative Background Decor for Mobile */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -z-10" />
            
            <div className="flex flex-col items-center gap-10 text-center">
               <Logo size="md" />
               <div className="h-[1px] w-20 bg-white/10" />
               
               <div className="flex flex-col gap-6">
                 {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl font-black uppercase tracking-tighter italic text-white/40 hover:text-primary transition-all active:scale-110"
                    >
                      {link.name}
                    </Link>
                  ))}
               </div>
              
              <div className="h-[1px] w-20 bg-white/10" />

              {isSignedIn ? (
                <div className="flex flex-col items-center gap-8">
                  <Link href="/dashboard" className="text-lg font-black uppercase tracking-[0.4em] text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    Enter Terminal
                  </Link>
                  <div className="scale-125">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <SignInButton mode="modal">
                    <button className="text-lg font-black uppercase tracking-[0.4em] text-white/30">Login Protocol</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-primary text-white text-lg font-black uppercase tracking-[0.2em] px-10 py-5 rounded-[1.5rem] shadow-skeuo-float">
                      Join Network
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
