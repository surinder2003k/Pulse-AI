import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { ADMIN_EMAIL } from "@/lib/utils";

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
    const { title, excerpt, content, category, tags, featureImage, status } = body;

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

