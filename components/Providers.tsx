"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import NextTopLoader from "nextjs-toploader";
import LoadingScreen from "./LoadingScreen";
import ParticleBackground from "./ParticleBackground";
import Navbar from "./Navbar";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <NextTopLoader color="#FF3333" showSpinner={false} />}
      <LoadingScreen />
      
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
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
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </>
  );
}
