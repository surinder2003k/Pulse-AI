import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import slugifyLib from "slugify";
import { ADMIN_EMAIL } from "@/lib/utils";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const { title, excerpt, content, category, tags, featureImage } = body;

    const slug = slugifyLib(title, { lower: true, strict: true });

    const authorName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "Anonymous";
    const authorImage = user.imageUrl;
    
    const post = await Post.create({
      user_id: user.id,
      title,
      slug,
      excerpt,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [],
      feature_image_url: featureImage,
      status: "published",
      is_ai_generated: body.is_ai_generated || false,
      author_name: authorName,
      author_image: authorImage,
      published_at: new Date(),
      views: 0
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Post Creation Error:", error.message);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userEmail = user.emailAddresses[0]?.emailAddress;

  try {
    await connectDB();
    const query = userEmail === ADMIN_EMAIL ? {} : { user_id: user.id };
    const posts = await Post.find(query).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
