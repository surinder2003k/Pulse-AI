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
          "relative flex items-center justify-between p-4 px-6 md:px-10 rounded-2xl transition-all duration-700 overflow-hidden",
          isScrolled 
            ? "bg-white/90 backdrop-blur-xl shadow-premium border-gray-200 border scale-[1.01]" 
            : "bg-transparent border-transparent"
        )}>
          {/* Inner Light reflection effect for scrolled state */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border border-gray-100 rounded-2xl pointer-events-none" 
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
                      "text-xs font-semibold uppercase tracking-widest transition-all relative group py-2",
                      isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {link.name}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 rounded-full",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                );
              })}
            </div>

            <div className="h-6 w-[1px] bg-gray-200" />

            <div className="flex items-center gap-6">
              {isSignedIn ? (
                <div className="flex items-center gap-6">
                  <Link href="/dashboard" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all group">
                    <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    Terminal
                  </Link>
                  {isAdmin && (
                    <Link href="/dashboard/create" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-all group">
                      <Zap className="w-4 h-4 fill-primary group-hover:scale-110 transition-transform" />
                      Initiate
                    </Link>
                  )}
                  <div className="p-1 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <SignInButton mode="modal">
                    <button className="text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg">
                      Join Network
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden relative z-50 p-2.5 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 text-gray-700 transition-all shadow-sm"
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
            className="fixed inset-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10"
          >
            
            <div className="flex flex-col items-center gap-10 text-center">
               <Logo size="md" />
               <div className="h-[1px] w-20 bg-gray-200" />
               
               <div className="flex flex-col gap-6">
                 {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl font-bold uppercase tracking-wider text-gray-700 hover:text-primary transition-all active:scale-110"
                    >
                      {link.name}
                    </Link>
                  ))}
               </div>
              
              <div className="h-[1px] w-20 bg-gray-200" />

              {isSignedIn ? (
                <div className="flex flex-col items-center gap-8">
                  <Link href="/dashboard" className="text-base font-bold uppercase tracking-widest text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    Terminal
                  </Link>
                  <div className="scale-125">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <SignInButton mode="modal">
                    <button className="text-sm font-bold uppercase tracking-widest text-gray-500">Login</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-primary text-white text-sm font-bold uppercase tracking-widest px-8 py-3 rounded-full shadow-md">
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
