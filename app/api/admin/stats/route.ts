import { NextResponse } from "next/server";
import { getAuthStatus } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  try {
    const { isAdmin } = await getAuthStatus();
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const totalPosts = await Post.countDocuments();
    
    return NextResponse.json({
        totalPosts,
        successRate: "98.4%", // Placeholder for now or can be derived from logs
        apiHealth: "Healthy"
    });
  } catch (error: any) {
    console.error("Stats fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
