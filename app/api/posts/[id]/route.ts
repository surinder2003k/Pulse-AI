import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import { ADMIN_EMAIL } from "@/lib/utils";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail === ADMIN_EMAIL;

  try {
    await connectDB();
    
    // Find by ID or Slug
    let post;
    if (mongoose.Types.ObjectId.isValid(id)) {
      post = await Post.findById(id).lean();
    } else {
      post = await Post.findOne({ slug: id }).lean();
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const postData = post as unknown as IPost;

    // Check ownership if not admin
    if (!isAdmin && postData.user_id !== user.id) {
       return NextResponse.json({ error: "Unauthorized access to this post" }, { status: 403 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail === ADMIN_EMAIL;

  try {
    await connectDB();
    const body = await req.json();
    const { title, excerpt, content, category, tags, featureImage, featureImageAlt, status, seoKeywords, focusKeyword, metaTitle, metaDescription } = body;

    // Admin can update any post; regular users only their own
    const filter = isAdmin ? { _id: id } : { _id: id, user_id: user.id };

    const post = await Post.findOneAndUpdate(
      filter,
      {
        title,
        excerpt,
        content,
        category,
        tags: Array.isArray(tags) ? tags : [],
        feature_image_url: featureImage,
        feature_image_alt: featureImageAlt || title,
        seoKeywords: seoKeywords || "",
        meta_title: metaTitle || "",
        meta_description: metaDescription || "",
        focus_keyword: focusKeyword || "",
        status: status || "published",
        published_at: new Date(),
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Update Post Error:", error.message);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userEmail = user.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail === ADMIN_EMAIL;

  try {
    await connectDB();

    // Admin can delete any post; regular users only their own
    const filter = isAdmin ? { _id: id } : { _id: id, user_id: user.id };
    const post = await Post.findOneAndDelete(filter);

    if (!post) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Post Error:", error.message);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

