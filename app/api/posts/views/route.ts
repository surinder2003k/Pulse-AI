import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

  try {
    await connectDB();
    
    // Atomically increment views
    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, views: post.views });
  } catch (error: any) {
    console.error("View Count Error:", error.message);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
