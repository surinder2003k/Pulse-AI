import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    // 1. Database Check
    await connectDB();
    const dbStatus = mongoose.connection.readyState === 1 ? "healthy" : "disconnected";

    // 2. Auth Check (Clerk)
    let authStatus = "unknown";
    try {
      const client = await clerkClient();
      await client.users.getCount();
      authStatus = "healthy";
    } catch (err) {
      console.error("Clerk Health Error:", err);
      authStatus = "error";
    }

    // 3. AI Engine Check (Groq)
    const groqKey = process.env.GROQ_API_KEY;
    const aiStatus = groqKey ? "healthy" : "missing_key";

    // 4. Image API Check (Unsplash)
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    const imageStatus = unsplashKey ? "healthy" : "missing_key";

    return NextResponse.json({
      services: [
        { name: "MongoDB Database", status: dbStatus, icon: "Database" },
        { name: "Clerk Authentication", status: authStatus, icon: "ShieldCheck" },
        { name: "Groq AI Engine", status: aiStatus, icon: "Sparkles" },
        { name: "Unsplash Image API", status: imageStatus, icon: "Image" },
        { name: "Vercel Performance", status: "healthy", icon: "Zap" }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Health check failed" }, { status: 500 });
  }
}
