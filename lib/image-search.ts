/**
 * Unified image search function with fallbacks (Unsplash -> Pexels -> Pixabay)
 * Returns an array of URLs.
 */
export async function searchImage(query: string): Promise<string[]> {
  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  console.log(`Searching images for: "${query}"`);

  // 1. Try Unsplash (High Quality)
  if (UNSPLASH_KEY) {
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=12&client_id=${UNSPLASH_KEY}`);
      if (res.ok) {
        const data = await res.json();
        const results = data?.results || [];
        if (results.length > 0) {
          console.log(`Found ${results.length} images on Unsplash`);
          return results.map((img: any) => img.urls.regular);
        }
      }
    } catch (e) {
      console.warn("Unsplash Fetch Error:", e);
    }
  }

  // 2. Fallback to Pexels
  if (PEXELS_KEY) {
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`, {
        headers: { Authorization: PEXELS_KEY }
      });
      if (res.ok) {
        const data = await res.json();
        const results = data?.photos || [];
        if (results.length > 0) {
          console.log(`Found ${results.length} images on Pexels`);
          return results.map((img: any) => img.src.large2x || img.src.large);
        }
      }
    } catch (e) {
        console.warn("Pexels Fetch Error:", e);
    }
  }

  // 3. Fallback to Pixabay
  if (PIXABAY_KEY) {
    try {
      const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=12`);
      if (res.ok) {
        const data = await res.json();
        const results = data?.hits || [];
        if (results.length > 0) {
          console.log(`Found ${results.length} images on Pixabay`);
          return results.map((img: any) => img.largeImageURL || img.webformatURL);
        }
      }
    } catch (e) {
        console.warn("Pixabay Fetch Error:", e);
    }
  }

  console.error("No images found across all providers for:", query);
  return [];
}
