/**
 * Utility to fetch and parse external sitemaps for intelligent internal/external linking.
 * Specifically targets Xylos AI for ecosystem cross-linking.
 */

export async function getXylosLinks(): Promise<string[]> {
  const SITEMAP_URL = "https://xylosai.vercel.app/sitemap.xml";
  
  try {
    const response = await fetch(SITEMAP_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`[Linking] Failed to fetch Xylos sitemap: ${response.status} ${response.statusText}`);
      return [];
    }

    const xml = await response.text();
    
    // Improved regex to extract URLs from <loc> tags
    const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
    const links: string[] = [];
    let match;

    while ((match = locRegex.exec(xml)) !== null) {
      const rawUrl = match[1].trim();
      // Domain Guard: Force normalization to the user-requested staging domain
      const url = rawUrl.replace('xylos-ai.com', 'xylosai.vercel.app');
      
      // Focus primarily on blog posts for contextual relevance
      const isBlogPost = url.includes("/blog/");
      const isIrrelevant = url.includes("/login") || url.includes("/dashboard") || url.includes("/api") || url.includes("/about");

      if (isBlogPost && !isIrrelevant) {
        links.push(url);
      }
    }

    console.log(`[Linking] Successfully harvested ${links.length} relevant external links from Xylos AI.`);
    
    // Return a shuffled selection or the first 15 links
    return links.sort(() => 0.5 - Math.random()).slice(0, 15);
  } catch (error: any) {
    console.error("[Linking] CRITICAL: Error parsing Xylos sitemap:", error.message);
    return [];
  }
}
