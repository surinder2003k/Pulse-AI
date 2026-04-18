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
              background: 'white',
              border: '1px solid #FF3333',
              color: '#0F172A',
              borderRadius: '1.25rem',
              boxShadow: '0 20px 25px -5px rgba(255, 51, 51, 0.1)',
              padding: '1.25rem 2rem',
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-space)'
            },
            className: 'premium-toast',
          }}
        />
      </ThemeProvider>
    </>
  );
}
