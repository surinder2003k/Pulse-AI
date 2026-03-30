import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const path = join(process.cwd(), "public", "uploads", filename);

    await writeFile(path, buffer);
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
