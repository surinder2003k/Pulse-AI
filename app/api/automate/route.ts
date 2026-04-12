import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import slugifyLib from "slugify";
import { generateContentWithFallback } from "@/lib/ai-generator";
import { ADMIN_EMAIL } from "@/lib/utils";
import { getXylosLinks } from "@/lib/external-links";

// Keys from environment variables
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// This route is called by Vercel Cron (configured in vercel.json) or manual trigger
export async function GET(req: Request) {
  // Simple auth check for cron
  const authHeader = req.headers.get('authorization');
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  
  // Check for Admin session if not a cron job
  let isAdmin = false;
  if (!isCron) {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    isAdmin = userEmail === ADMIN_EMAIL;
  }

  if (process.env.NODE_ENV === 'production' && !isCron && !isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log("Cron triggered: Generating trending automated post...");

  try {
    await connectDB();
    
    console.log("Fetching ecosystem and internal links for automation...");
    const { getLinkingContext } = await import("@/lib/linking");
    const { internal, external } = await getLinkingContext();
    
    const internalText = internal.length > 0 
      ? `INTERNAL LINKING (Pulse AI): You MUST naturally link to 1 of these related stories on our site: [${internal.map(i => `${i.title}: ${i.url}`).join(", ")}].` 
      : "";
    
    const externalText = external.length > 0 
      ? `EXTERNAL LINKING (Partner): You MUST naturally link to 1 of these Xylos AI stories as a deeper resource: [${external.join(", ")}].` 
      : "";

    const linksContext = `${internalText} ${externalText} IMPORTANT: Use natural anchor text (e.g. "discover more about [topic]", "latest reports reveal"). These MUST be formatted as HTML <a> tags.`;

    // Fetch recent post titles to avoid duplicating topics
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(10).select('title').lean();
    const recentTitles = recentPosts.map(p => p.title).join(", ");

    const Settings = (await import("@/models/Settings")).default;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({ automationEnabled: true, automationCategory: "Technology" });
    }

    if (!settings.automationEnabled) {
      console.log("Automation cancelled: automationEnabled is false in Settings.");
      return new Response('Automation is disabled by Admin', { status: 200 });
    }

    const createdPosts = [];

    for (let i = 0; i < 2; i++) {
      console.log(`Automation iteration ${i + 1}/2...`);
      
      // Step 1: Prompt Gemini to pick a trending topic
      const automationPrompt = `You are an expert AI journalist and SEO content creator.
      Identify a highly trending global news topic or major breakthrough from the last 24-48 hours specifically in the "${settings.automationCategory}" category.
      
      CRITICAL: DO NOT write about any of these recent topics: [${recentTitles}]. 
      You MUST choose something unique and fresh that hasn't been covered in the list above.
      
      Write a highly optimized, fully SEO-friendly, comprehensive article about this NEW trending ${settings.automationCategory} topic.
      
      The article MUST be detailed and long-form, approximately 1000 to 1200 words.
      Use proper headings, bullet points, and structure for readability and SEO ranking.
      
      Format the response STRICTLY as a JSON object with these exact keys:
      {
        "title": "A highly engaging, SEO-optimized title for the trending news",
        "meta_title": "A custom SEO title for Google (max 60 chars)",
        "meta_description": "A compelling meta description (max 160 chars)",
        "focus_keyword": "The primary focus keyword for this article",
        "content": "Full Markdown content (1000-1200 words) discussing the news.",
        "excerpt": "A powerful short summary for cards/previews (max 160 chars)",
        "category": "${settings.automationCategory}",
        "tags": ["trending", "${settings.automationCategory.toLowerCase()}", "seo-tag1", "seo-tag2"],
        "imageSearchKeyword": "A generic 1-2 word English keyword (like 'technology', 'nature', 'city') to find a high-quality relevant background image on Unsplash. DO NOT use specific brand names or acronyms.",
        "image_alt": "A descriptive ALT tag for the news visual"
      }

      ${linksContext}
      
      Important: Return ONLY the JSON object. NO markdown blocks or other text outside the JSON. Ensure the JSON is valid and minified.`;

      console.log(`Requesting trending article ${i + 1} from Multi-Provider AI Fallback...`);
      let text = "";
      
      try {
        text = await generateContentWithFallback(automationPrompt, 0.8);
        console.log(`Automation generation ${i + 1} succeeded.`);
      } catch (aiError: any) {
        console.error(`AI Provider failed in iteration ${i + 1}:`, aiError);
        continue;
      }
      
      try {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const postData = JSON.parse(text.substring(jsonStart, jsonEnd));
        
        // Safety check: Skip if title matches any existing post
        const exists = await Post.findOne({ title: postData.title });
        if (exists) {
            console.log(`Skipping duplicate content: "${postData.title}"`);
            continue;
        }

        console.log(`Generated Unique Trending Post ${i + 1}:`, postData.title);

        // Step 2: Multi-Provider Image Search (Unsplash, Pexels, Pixabay)
        console.log("Finding Visuals for automation...");
        const { searchImage } = await import("@/lib/image-search");
        const searchKeyword = `${postData.imageSearchKeyword || postData.category} ${postData.title.split(' ').slice(0, 3).join(' ')}`;
        const images = await searchImage(searchKeyword);
        const featureImage = (Array.isArray(images) ? images[0] : images) || "https://images.unsplash.com/photo-1677442136019-21780ecad995";


        // Step 3: Save to MongoDB
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

        const newPost = await Post.create({
          user_id: "system_automation",
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

        createdPosts.push(newPost);
        console.log(`Automation iteration ${i + 1} Success! Post created:`, newPost.slug);
      } catch (parseError: any) {
        console.error(`Failed to parse or save post in iteration ${i + 1}:`, parseError);
      }
    }


    if (createdPosts.length === 0) {
      throw new Error("Failed to generate any posts in this automation run.");
    }

    return NextResponse.json({ 
      success: true, 
      count: createdPosts.length,
      posts: createdPosts.map(p => ({ title: p.title, slug: p.slug }))
    });

  } catch (error: any) {
    console.error("Automation GLOBAL ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
