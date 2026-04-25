"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import NextTopLoader from "nextjs-toploader";
import SplashLoader from "./SplashLoader";
import ParticleBackground from "./ParticleBackground";
import Navbar from "./Navbar";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <SplashLoader />
      {mounted && <NextTopLoader color="#FF3333" showSpinner={false} />}
      
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <ParticleBackground />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster 
          position="bottom-right" 
          richColors 
          closeButton
          expand={true}
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              fontFamily: 'var(--font-inter)'
            },
            className: '',
          }}
        />
      </ThemeProvider>
    </>
  );
}
