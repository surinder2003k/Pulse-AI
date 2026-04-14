import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import slugifyLib from "slugify";
import { generateContentWithFallback } from "@/lib/ai-generator";
import { getXylosLinks } from "@/lib/external-links";

// Keys from environment variables
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const body = await req.json();
  const userPrompt = body.prompt;

  if (!userPrompt) {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }

  // Rate Limiting (5 per user/hour)
  try {
    await connectDB();
    const oneHourAgo = new Date(Date.now() - 3600000);
    const count = await Post.countDocuments({
      user_id: userId,
      is_ai_generated: true,
      createdAt: { $gt: oneHourAgo }
    });

    if (count >= 5) {
      return NextResponse.json({ error: "Rate limit exceeded (5/hour)" }, { status: 429 });
    }
  } catch (err: any) {
    console.warn("Rate limit check failed, skipping limit:", err.message);
  }
  
  try {
    console.log("Step 1: Fetching ecosystem and internal links...");
    const { getLinkingContext } = await import("@/lib/linking");
    const { internal, external } = await getLinkingContext();
    
    const internalText = internal.length > 0 
      ? `INTERNAL LINKING (Pulse AI): You MUST naturally link to 1 of these related stories on our site: [${internal.map(i => `${i.title}: ${i.url}`).join(", ")}].` 
      : "";
    
    const externalText = external.length > 0 
      ? `EXTERNAL LINKING (Partner): You MUST naturally link to 1 of these Xylos AI stories as a deeper resource: [${external.join(", ")}].` 
      : "";

    const linksContext = `${internalText} ${externalText} IMPORTANT: Use natural anchor text. CRITICAL: You MUST use the EXACT URLs provided above (specifically starting with "https://xylosai.vercel.app/"). DO NOT alter them to "xylos-ai.com" or any other domain. These MUST be formatted as Markdown links: [Anchor Text](URL). DO NOT USE HTML <a> TAGS.`;

    console.log("Step 2: Generating content directly from user prompt...");
    let postData: any;

    // DIRECT USER PROMPT: No personas, no hardcoded tone. Just the user's exact topic/instructions.
    // We only append the format requirement so it returns usable JSON.
    const directPrompt = `You are an expert technical editorial writer. Write a highly optimized, fully SEO-friendly, comprehensive article based exactly on this topic:
    "${userPrompt}"
    
    The article MUST be detailed and lengthy, approximately 1500 to 2000 words.
    
    IMPORTANT FORMATTING RULES:
    1. Use well-formatted Markdown.
    2. Use <h2> and <h3> for headings.
    3. Use <ul>, <ol>, and <li> for lists.
    4. CRITICAL STRUCTURAL RULES:
       - Start EVERY line at column 0 (no leading spaces/indentation).
       - Use DOUBLE NEWLINES (\n\n) between every paragraph.
       - Use DOUBLE NEWLINES before every heading.
       - Ensure a space follows every '#' in headers (e.g. '## Header').
    
    Format the response STRICTLY as a JSON object with these exact keys:
    {
      "title": "A highly engaging, SEO-optimized title",
      "meta_title": "A custom SEO title for Google (max 60 chars)",
      "meta_description": "A compelling meta description (max 160 chars)",
      "focus_keyword": "The primary focus keyword for this article",
      "content": "<h2>Introduction</h2><p>First paragraph here...</p><p>Second paragraph...</p><h3>Key Benefits</h3><ul><li>Point 1</li><li>Point 2</li></ul><p>Conclusion paragraph...</p>",
      "excerpt": "A powerful short summary for cards/previews (max 160 chars)",
      "category": "Technology, Business, News, or whichever fits best",
      "tags": ["seo-tag1", "seo-tag2", "seo-tag3", "seo-tag4", "seo-tag5"],
      "imageSearchKeyword": "A generic 1-2 word English keyword (like 'technology', 'city') for Unsplash",
      "image_alt": "A descriptive ALT tag for the feature image"
    }

    ${linksContext}
    
    Return ONLY JSON. No external markdown, no conversational text.`;

    try {
      console.log("Attempting generation using Multi-Provider Fallback...");
      const text = await generateContentWithFallback(directPrompt);
      
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      postData = JSON.parse(text.substring(jsonStart, jsonEnd));
      
      console.log("AI generated post successfully:", postData.title);
    } catch (aiError: any) {
      console.error("All AI Providers Failed:", aiError);
      throw new Error("All AI Providers exhausted their quotas or failed. Please try again later.");
    }

    // Step 2: Unsplash Images
    console.log("Step 2: Finding Visuals...");
    let featureImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995";
    try {
      const searchKeyword = postData.imageSearchKeyword || postData.category || "technology";
      const imageRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchKeyword)}&orientation=landscape&order_by=relevant&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
      if (imageRes.ok) {
        const imageData = await imageRes.json();
        featureImage = imageData?.results?.[0]?.urls?.regular || featureImage;
      }
    } catch (imgErr) {
      console.warn("Unsplash fetching failed.");
    }

    // Step 3: Saving to DB...
    console.log("Step 3: Saving to DB...");
    
    let slug = slugifyLib(postData.title, { lower: true, strict: true });
    
    let existingPost = await Post.findOne({ slug }).lean();
    let counter = 1;
    while (existingPost) {
      const newSlug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug: newSlug }).lean();
      if (!existingPost) {
        slug = newSlug;
        break;
      }
      counter++;
    }
    
    try {
      const newPost = await Post.create({
        user_id: userId,
        title: postData.title,
        slug: slug,
        excerpt: postData.excerpt,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        meta_title: postData.meta_title,
        meta_description: postData.meta_description,
        focus_keyword: postData.focus_keyword,
        feature_image_url: featureImage,
        feature_image_alt: postData.image_alt || postData.title,
        status: "published",
        is_ai_generated: true,
        published_at: new Date()
      });

      console.log("Generation Success! Post created:", newPost.slug);
      return NextResponse.json(newPost);
    } catch (dbError: any) {
      console.warn("MongoDB Save Failed (Possible Duplicate):", dbError.message);
      // If saving fails (e.g. duplicate slug), we still return the generated data so they can see it
      return NextResponse.json({
        ...postData,
        _id: null,
        feature_image_url: featureImage,
        content: postData.content
      });
    }

  } catch (error: any) {
    console.error("FINAL GENERATION ERROR:", error.message);
    // Explicitly fail to the frontend instead of sending dummy fallback text
    return NextResponse.json({ error: error.message || "Failed to generate post" }, { status: 500 });
  }
}
