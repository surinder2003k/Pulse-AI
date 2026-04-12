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
      console.error(`Failed to fetch sitemap: ${response.statusText}`);
      return [];
    }

    const xml = await response.text();
    
    // Simple regex to extract URLs from <loc> tags
    const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
    const links: string[] = [];
    let match;

    while ((match = locRegex.exec(xml)) !== null) {
      const url = match[1];
      // Filter out root, legal, or administrative pages if necessary
      if (
        !url.endsWith("/") && 
        !url.includes("/login") && 
        !url.includes("/dashboard") &&
        !url.includes("/api")
      ) {
        links.push(url);
      }
    }

    // Return the latest 20 links to keep prompt size manageable
    return links.slice(0, 20);
  } catch (error) {
    console.error("Error parsing Xylos sitemap:", error);
    return [];
  }
}
