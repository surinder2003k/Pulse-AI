import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use absolute path for robustness
    const uploadsDir = join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists using the top-level import
    await mkdir(uploadsDir, { recursive: true });

    // Sanitize filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = join(uploadsDir, filename);

    await writeFile(filePath, buffer);
    const url = `/uploads/${filename}`;

    console.log(`Success: File uploaded to ${url}`);
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Critical Upload Error:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error.message 
    }, { status: 500 });
  }
}
