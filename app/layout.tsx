import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextTopLoader from "nextjs-toploader";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pulse-blog-ai.vercel.app"),
  title: "Pulse AI | Stories That Move You. F1, Tech, & Sports.",
  description: "Dive into the pulse of global stories. From high-octane F1 race reports to tactical football deep dives and the latest in AI innovation, see the world through a human lens.",
  keywords: [
    "Pulse AI", "F1 race analysis", "Football tactical deep dives", "AI research stories",
    "Skeuomorphic design", "Premium tech blog", "Digital magazine", "Global Sports"
  ],
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  verification: {
    google: "7DDDhNUg6jYfqTlpcjhcRviMdzzUvxJd2Y-rKmNEqdk",
  },
  alternates: {
    canonical: "https://pulse-blog-ai.vercel.app",
  },
  openGraph: {
    title: "Pulse AI | Stories That Move You.",
    description: "High-octane F1, Football, and Tech stories delivered with a premium skeuomorphic experience.",
    url: "https://pulse-blog-ai.vercel.app",
    siteName: "Pulse AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pulse AI – Stories with a Soul",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse AI | Stories That Move You.",
    description: "Experience the adrenaline of F1, Football and Tech with Pulse AI's premium storytelling.",
    images: ["/og-image.png"],
  },
};

import ParticleBackground from "@/components/ParticleBackground";

// ... (rest of imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
          {/* ... (script) */}
          <NextTopLoader color="#FF3333" showSpinner={false} />
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
        </body>
      </html>
    </ClerkProvider>
  );
}
