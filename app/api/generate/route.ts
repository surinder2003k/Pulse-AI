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

    const linksContext = `${internalText} ${externalText} IMPORTANT: Use natural anchor text. CRITICAL: You MUST use the EXACT URLs provided above. DO NOT alter them. You MUST use ONLY HTML syntax: <a href="URL">Anchor Text</a>. NEVER use Markdown syntax like [text](url). For bold text, use <strong>.`;

    console.log("Step 2: Generating content directly from user prompt...");
    let postData: any;

    const directPrompt = `You are an expert technical editorial writer for a premium digital publication named Pulse AI. Write a high-end, authoritative, and fully SEO-optimized article based exactly on this topic:
    "${userPrompt}"
    
    The article MUST be detailed, approximately 1200 to 1800 words. 
    Tone: Authoritative, Visionary, Tactical.
    
    IMPORTANT FORMATTING RULES:
    1. Use SEMANTIC HTML for the content.
    2. Use <h2> and <h3> for headings.
    3. Use <p> for paragraphs.
    4. Use <ul>, <ol>, and <li> for lists. Use <strong> for emphasis.
    5. INSERT TWO IMAGE PLACEHOLDERS: Use [[BODY_IMAGE_1]] and [[BODY_IMAGE_2]] exactly where a supporting visual makes sense.
    
    Format the response STRICTLY as a JSON object with these exact keys:
    {
      "title": "A highly engaging, editorial-grade title",
      "meta_title": "A custom SEO title for Google (max 60 chars)",
      "meta_description": "A compelling meta description (max 160 chars)",
      "focus_keyword": "The primary focus keyword for this article",
      "seoKeywords": "4-5 comma separated keywords",
      "content": "Full HTML content starting with <h2>Introduction</h2>. Place [[BODY_IMAGE_1]] and [[BODY_IMAGE_2]] in suitable spots.",
      "excerpt": "A powerful short summary for cards/previews (max 160 chars)",
      "category": "Technology, Business, News, or Intelligence",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "imageSearchKeyword": "A highly descriptive 2-3 word English keyword for the main feature image",
      "bodyImageKeyword1": "A descriptive keyword for the first visual asset",
      "bodyImageKeyword2": "A descriptive keyword for the second visual asset",
      "image_alt": "A descriptive ALT tag for visual assets"
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
      throw new Error("Neural Synthesis Interrupted: " + aiError.message);
    }

    // Step 2: Unsplash Visual Synthesis
    console.log("Step 2: Finding Visual Assets...");
    let featureImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995";
    let bodyImage1 = "";
    let bodyImage2 = "";
    
    try {
      // Feature Image
      const featureKw = postData.imageSearchKeyword || postData.category || "technology";
      const featRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(featureKw)}&orientation=landscape&order_by=relevant&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
      if (featRes.ok) {
        const featData = await featRes.json();
        featureImage = featData?.results?.[0]?.urls?.regular || featureImage;
      }

      // Body Image 1
      const bodyKw1 = postData.bodyImageKeyword1 || featureKw;
      const bodyRes1 = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(bodyKw1)}&orientation=landscape&order_by=relevant&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
      if (bodyRes1.ok) {
        const bodyData1 = await bodyRes1.json();
        bodyImage1 = bodyData1?.results?.[0]?.urls?.regular || "";
      }

      // Body Image 2
      const bodyKw2 = postData.bodyImageKeyword2 || featureKw;
      const bodyRes2 = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(bodyKw2)}&orientation=landscape&order_by=relevant&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
      if (bodyRes2.ok) {
        const bodyData2 = await bodyRes2.json();
        bodyImage2 = bodyData2?.results?.[0]?.urls?.regular || "";
      }
    } catch (imgErr) {
      console.warn("Visual synthesis partial failure.");
    }

    // Inject images into content using premium figure/img tags
    if (bodyImage1) {
      postData.content = postData.content.replace("[[BODY_IMAGE_1]]", `<figure class="my-8 rounded-3xl overflow-hidden border border-slate-100 shadow-sm"><img src="${bodyImage1}" alt="${postData.image_alt || "Visual Context"}" class="w-full h-auto object-cover"/><figcaption class="p-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center italic border-t border-slate-100">Asset 01 // Narrative Context</figcaption></figure>`);
    } else {
      postData.content = postData.content.replace("[[BODY_IMAGE_1]]", "");
    }

    if (bodyImage2) {
      postData.content = postData.content.replace("[[BODY_IMAGE_2]]", `<figure class="my-8 rounded-3xl overflow-hidden border border-slate-100 shadow-sm"><img src="${bodyImage2}" alt="${postData.image_alt || "Deep Tech Context"}" class="w-full h-auto object-cover"/><figcaption class="p-4 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center italic border-t border-slate-100">Asset 02 // Strategic Intel</figcaption></figure>`);
    } else {
      postData.content = postData.content.replace("[[BODY_IMAGE_2]]", "");
    }

    // Step 3: Saving to DB...
    console.log("Step 3: Committing to Global Matrix...");
    
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
        seoKeywords: postData.seoKeywords,
        feature_image_url: featureImage,
        feature_image_alt: postData.image_alt || postData.title,
        status: "published",
        is_ai_generated: true,
        published_at: new Date()
      });

      console.log("Generation Success! Post deployed:", newPost.slug);
      return NextResponse.json(newPost);
    } catch (dbError: any) {
      console.warn("Local Registry Save Failed:", dbError.message);
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
