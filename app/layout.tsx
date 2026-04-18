import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "../components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import AuthErrorRelay from "@/components/AuthErrorRelay";
import Script from "next/script";

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

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        {/* Google Tag Manager - Integrated via next/script for optimal performance */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T4G5FQT9');`}
        </Script>

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FBCB03803G"
          strategy="afterInteractive"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FBCB03803G');
          `}
        </Script>

        {/* Google Tag Manager (noscript) - Essential for backup tracking */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T4G5FQT9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <ClerkProvider>
          <Providers>
            {children}
            <ScrollToTop />
            <AuthErrorRelay />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
