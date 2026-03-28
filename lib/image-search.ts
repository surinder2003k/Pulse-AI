/**
 * Unified image search function with fallbacks (Unsplash -> Pexels -> Pixabay)
 */
export async function searchImage(query: string): Promise<string | null> {
  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
  const PEXELS_KEY = process.env.PEXELS_API_KEY;
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

  console.log(`Searching images for: "${query}"`);

  // 1. Try Unsplash (High Quality)
  if (UNSPLASH_KEY) {
    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=10&page=${randomPage}&client_id=${UNSPLASH_KEY}`);
      if (res.ok) {
        const data = await res.json();
        const results = data?.results || [];
        if (results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(results.length, 5));
          console.log("Found image on Unsplash");
          return results[randomIndex]?.urls?.regular;
        }
      }
    } catch (e) {
      console.warn("Unsplash Fetch Error:", e);
    }
  }

  // 2. Fallback to Pexels
  if (PEXELS_KEY) {
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`, {
        headers: { Authorization: PEXELS_KEY }
      });
      if (res.ok) {
        const data = await res.json();
        const results = data?.photos || [];
        if (results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(results.length, 5));
          console.log("Found image on Pexels");
          return results[randomIndex]?.src?.large2x || results[randomIndex]?.src?.large;
        }
      }
    } catch (e) {
        console.warn("Pexels Fetch Error:", e);
    }
  }

  // 3. Fallback to Pixabay
  if (PIXABAY_KEY) {
    try {
      const res = await fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=10`);
      if (res.ok) {
        const data = await res.json();
        const results = data?.hits || [];
        if (results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(results.length, 5));
          console.log("Found image on Pixabay");
          return results[randomIndex]?.largeImageURL || results[randomIndex]?.webformatURL;
        }
      }
    } catch (e) {
        console.warn("Pixabay Fetch Error:", e);
    }
  }

  console.error("No images found across all providers for:", query);
  return null;
}
