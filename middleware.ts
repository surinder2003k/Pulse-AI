import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/api/automate", // Cron job public but should have secret header (handled in route)
  "/api/generate", // Internal AI generation (rate limited in route)
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Bypass completely for Search Crawlers & Bots to prevent Redirect Errors in Google Search Console
  const userAgent = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot/i.test(userAgent);
  
  if (isBot) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Protect private routes — redirect to sign-in if not logged in
  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }

  // For admin routes, require a logged-in user.
  // The actual email check is done inside app/admin/page.tsx using currentUser()
  // which is more reliable than sessionClaims (which may not contain email).
  if (isAdminRoute(req) && !userId) {
    return (await auth()).redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

