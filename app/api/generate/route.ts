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

    const directPrompt = `You are an elite technical editorial architect for Pulse AI. Write a definitive, high-end editorial piece based on: "${userPrompt}"
    
    CRITICAL REQUIREMENTS:
    1. EXHAUSTIVE CONTENT: Approx 1200-1800 words. Deep analysis, tactical insights, and visionary perspective.
    2. METADATA MASTERY: Every JSON field MUST be filled with premium, punchy, and SEO-optimized text. No field should be empty.
    3. SEARCH COMPLIANCE: Use focus_keyword naturally in <h2> headings and first paragraph.
    
    FORMATTING:
    - Content in SEMANTIC HTML (<h2>, <h3>, <p>, <ul>, <strong>).
    - Insert [[BODY_IMAGE_1]] and [[BODY_IMAGE_2]] at strategic mid-points.
    
    STRICT JSON SCHEMA:
    {
      "title": "Editorial Headline (Punchy, All Caps Style)",
      "meta_title": "SEO Title | Maximum 60 Chars",
      "meta_description": "Engaging Search Snippet | Maximum 160 Chars",
      "focus_keyword": "Primary SEO Keyword",
      "seoKeywords": "4-5 targeting keywords, comma separated",
      "content": "Full HTML starting with <h2>Introduction</h2>",
      "excerpt": "Compelling 2-sentence hook for the feed",
      "category": "Technology, Business, News, or Intelligence",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "imageSearchKeyword": "Vivid 2-word keyword for thumbnail image",
      "bodyImageKeyword1": "Contextual keyword for body visual 1",
      "bodyImageKeyword2": "Contextual keyword for body visual 2",
      "image_alt": "Descriptive accessibility text for all visual assets"
    }

    ${linksContext}
    Return ONLY JSON. No conversational filler.`;

    try {
      console.log("Attempting generation...");
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

    // Inject images into content
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
        status: "draft", // Saved as draft
        is_ai_generated: true
      });

      console.log("Generation Success! Post deployed as draft:", newPost.slug);
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
    return NextResponse.json({ error: error.message || "Failed to generate post" }, { status: 500 });
  }
}
