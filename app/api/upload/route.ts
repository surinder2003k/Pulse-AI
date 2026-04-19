import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
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

    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure we have a valid absolute path to the public/uploads directory
    const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
    
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (mkdirError: any) {
      console.error("Directory Creation Failed:", mkdirError.message);
      return NextResponse.json({ 
        error: "Server storage initialization failed", 
        details: mkdirError.message 
      }, { status: 500 });
    }

    // Sanitize filename to avoid path traversal or Windows invalid chars
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = path.join(uploadsDir, filename);

    try {
      await writeFile(filePath, buffer);
    } catch (writeError: any) {
      console.error("File Write Failed:", writeError.message);
      return NextResponse.json({ 
        error: "Failed to save file to server", 
        details: writeError.message 
      }, { status: 500 });
    }

    const url = `/uploads/${filename}`;
    console.log(`Success: File uploaded to ${url}`);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Critical Upload Error:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error.message || "An unexpected error occurred"
    }, { status: 500 });
  }
}
