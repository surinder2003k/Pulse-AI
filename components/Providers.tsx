"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import NextTopLoader from "nextjs-toploader";
import LoadingScreen from "./LoadingScreen";
import ParticleBackground from "./ParticleBackground";
import Navbar from "./Navbar";

import SiteLoadSound from "./SiteLoadSound";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <NextTopLoader color="#FF3333" showSpinner={false} />}
      
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <SiteLoadSound />
        <ParticleBackground />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster 
          position="top-center" 
          richColors 
          expand={false}
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              borderRadius: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              padding: '1rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            },
          }}
        />
      </ThemeProvider>
    </>
  );
}
