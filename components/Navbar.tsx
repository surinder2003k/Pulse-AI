"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, PenSquare, Menu, X, Zap, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import { cn, ADMIN_EMAIL } from "@/lib/utils";
import { useSound } from "./SoundProvider";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const isDashboard = pathname?.startsWith("/dashboard");
  const forceScrolledStyle = isScrolled || isDashboard;

  const navLinks = [
    { name: "Intelligence", href: "/blog" },
    { name: "About Us", href: "/about" },
  ];

  const playHoverSound = (path: string) => {
    playSound(path, 0.2);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[60] transition-all duration-700",
      forceScrolledStyle ? "py-3 px-6 md:px-10" : "py-6 px-6 md:px-10"
    )}>
      <div className="container mx-auto">
        <div className={cn(
          "relative flex items-center justify-between p-4 px-6 md:px-10 rounded-2xl transition-all duration-700 overflow-hidden",
          forceScrolledStyle 
            ? "bg-white/90 backdrop-blur-xl shadow-premium border-gray-200 border scale-[1.01]" 
            : "bg-transparent border-transparent"
        )}>
          {/* Inner Light reflection effect for scrolled state */}
          <AnimatePresence>
            {forceScrolledStyle && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border border-gray-100 rounded-2xl pointer-events-none" 
              />
            )}
          </AnimatePresence>

          {/* Logo Section */}
          <Link 
            href="/" 
            className="relative z-50 group"
            onMouseEnter={() => playHoverSound('/sounds/anime-ahh.mp3')}
            title="Pulse AI - Home"
          >
            <Logo size="sm" playSoundOnHover={false} />
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
                    title={`View ${link.name}`}
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
                  <Link href="/dashboard" title="Access Dashboard" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all group">
                    <LayoutDashboard className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    Terminal
                  </Link>
                  {isAdmin && (
                    <Link href="/dashboard/create" title="Create New Post" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-all group">
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

      {/* Mobile Menu - Sidebar Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white z-50 lg:hidden shadow-2xl flex flex-col"
            >
              {/* Header / Brand */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <Logo size="sm" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* User Section */}
              <div className="p-8 bg-gray-50/50">
                {isSignedIn ? (
                  <div className="flex items-center gap-4">
                    <div className="p-1 rounded-full bg-white border border-gray-200 shadow-sm">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-900 truncate max-w-[150px]">
                        {user.fullName || "User Active"}
                      </span>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                        Network Member
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <button className="w-full text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 transition-all">
                        Login Terminal
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>

              {/* Navigation List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 flex items-center gap-3">
                    <div className="h-[1px] w-4 bg-gray-200" />
                    Core Protocol
                  </h4>
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-700 group-hover:text-primary transition-colors">
                          {link.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                    {isSignedIn && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-sm font-bold uppercase tracking-widest text-primary">
                          Initialize Dashboard
                        </span>
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                      </Link>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 flex items-center gap-3">
                      <div className="h-[1px] w-4 bg-gray-200" />
                      Management
                    </h4>
                    <Link
                      href="/dashboard/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between group"
                    >
                      <span className="text-sm font-bold uppercase tracking-widest text-primary">
                         AI Asset Manager
                      </span>
                      <Zap className="w-4 h-4 text-primary fill-primary" />
                    </Link>
                  </div>
                )}
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
