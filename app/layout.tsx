import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse AI | Premium Content Engine",
  description: "Experience the next generation of blogging with AI-powered trending stories and premium Indian aesthetics.",
  keywords: ["Pulse AI", "AI Blog", "Next.js", "Automation", "Premium Content", "Indian Tech Blog"],
  verification: {
    google: "7DDDhNUg6jYfqTlpcjhcRviMdzzUvxJd2Y-rKmNEqdk",
  },
  alternates: {
    canonical: "https://pulse-blog-ai.vercel.app",
  },
  openGraph: {
    title: "Pulse AI | Premium Content Engine",
    description: "Experience the next generation of blogging with AI-powered trending stories.",
    url: "https://pulse-blog-ai.vercel.app",
    siteName: "Pulse AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pulse AI Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse AI | Premium Content Engine",
    description: "AI-powered trending stories and premium Indian aesthetics.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
          <NextTopLoader color="#a855f7" showSpinner={false} />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
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
