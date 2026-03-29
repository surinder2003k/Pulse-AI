import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import NextTopLoader from "nextjs-toploader";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse AI | Premium Content Engine",
  description: "Experience the next generation of blogging with AI-powered trending stories and premium Indian aesthetics. Pulse AI delivers automated, high-quality content for the modern web.",
  keywords: [
    "Pulse AI", "AI Blog", "Next.js 15", "Automation", "Premium Content", "Indian Tech Blog", 
    "AI Writing Assistant", "Automated Content Creation", "Trending News AI", "Future of Blogging", 
    "Artificial Intelligence Content Strategy", "Pulse AI Generator", "Smart News Hub", 
    "AI-Powered Storytelling", "Next-Gen Blogging Platform", "Automated Journalism", 
    "Tech Insights AI", "Digital Content Automation", "SEO Optimized AI Articles", 
    "Intelligent Content Engine", "AI News Hub India", "Automated Blog Writer"
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
    title: "Pulse AI | Premium Content Engine",
    description: "AI-powered trending stories and premium Indian aesthetics. Discover the future of automated content.",
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
    locale: "en_IN",
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Pulse AI",
                "url": "https://pulse-blog-ai.vercel.app",
                "publisher": {
                  "@type": "Organization",
                  "name": "Pulse AI",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://pulse-blog-ai.vercel.app/logo.svg"
                  }
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://pulse-blog-ai.vercel.app/blog?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }),
            }}
          />
          <NextTopLoader color="#a855f7" showSpinner={false} />
          <LoadingScreen />
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
