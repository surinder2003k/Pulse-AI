import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    console.error("Upload Error: User not authenticated");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`Uploading file to ImageKit: ${file.name}, size: ${file.size} bytes`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
      folder: "/pulse_ai_thumbnails",
      useUniqueFileName: true,
    });
    
    console.log(`Success: File uploaded to ImageKit: ${result.url}`);

    return NextResponse.json({ url: result.url });
  } catch (error: any) {
    console.error("Critical Upload Error:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error.message || "An unexpected error occurred during ImageKit upload"
    }, { status: 500 });
  }
}
