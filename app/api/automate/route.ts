import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import slugifyLib from "slugify";
import { generateContentWithFallback } from "@/lib/ai-generator";

// Keys from environment variables
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// This route is called by Vercel Cron (configured in vercel.json) or manual trigger
export async function GET(req: Request) {
  // Simple auth check for cron
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log("Cron triggered: Generating trending automated post...");

  try {
    await connectDB();
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
      
      // Step 1: Prompt Gemini to pick a trending topic and write a full article on it
      const automationPrompt = `You are an expert AI journalist and SEO content creator.
      Identify a highly trending global news topic or major breakthrough from the last 24-48 hours specifically in the "${settings.automationCategory}" category.
      ${i > 0 ? "Ensure this topic is DIFFERENT from the previous one you just wrote about." : ""}
      Write a highly optimized, fully SEO-friendly, comprehensive article about this trending ${settings.automationCategory} topic.
      
      The article MUST be detailed and lengthy, approximately 2000 to 2500 words.
      Use proper headings, bullet points, and structure for readability and SEO ranking.
      
      Format the response STRICTLY as a JSON object with these exact keys:
      {
        "title": "A highly engaging, SEO-optimized title for the trending news",
        "content": "Full lengthy markdown content (2000-2500 words) discussing the news.",
        "excerpt": "A powerful SEO meta description (max 160 chars)",
        "category": "${settings.automationCategory}",
        "tags": ["trending", "${settings.automationCategory.toLowerCase()}", "seo-tag1", "seo-tag2"],
        "imageSearchKeyword": "A generic 1-2 word English keyword (like 'technology', 'nature', 'city') to find a high-quality relevant background image on Unsplash. DO NOT use specific brand names or acronyms."
      }
      
      Important: Return ONLY the JSON object. NO markdown blocks or other text outside the JSON.`;

      console.log(`Requesting trending article ${i + 1} from Multi-Provider AI Fallback...`);
      let text = "";
      
      try {
        text = await generateContentWithFallback(automationPrompt, 0.8);
        console.log(`Automation generation ${i + 1} succeeded.`);
      } catch (aiError: any) {
        console.error(`AI Provider failed in iteration ${i + 1}:`, aiError);
        continue; // Try next iteration if one fails
      }
      
      try {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const postData = JSON.parse(text.substring(jsonStart, jsonEnd));
        
        console.log(`Generated Trending Post ${i + 1}:`, postData.title);

        // Step 2: Unsplash Images
        console.log("Finding Visuals for automation...");
        let featureImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995";
        try {
          const searchKeyword = postData.imageSearchKeyword || postData.category || "breaking news";
          const imageRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchKeyword)}&orientation=landscape&order_by=relevant&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
          if (imageRes.ok) {
            const imageData = await imageRes.json();
            featureImage = imageData?.results?.[0]?.urls?.regular || featureImage;
          }
        } catch (imgErr) {
          console.warn("Unsplash fetching failed in automation.");
        }

        // Step 3: Save to MongoDB
        const slug = slugifyLib(postData.title, { lower: true, strict: true });
        const newPost = await Post.create({
          user_id: "system_automation",
          title: postData.title,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
          excerpt: postData.excerpt,
          content: postData.content,
          category: postData.category,
          tags: postData.tags,
          feature_image_url: featureImage,
          status: "published",
          is_ai_generated: true,
          published_at: new Date(),
          views: 0
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
