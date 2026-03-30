import { NextResponse } from "next/server";
import { searchImage } from "@/lib/image-search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const imageUrls = await searchImage(q);
    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 404 });
    }

    return NextResponse.json({ urls: imageUrls });
  } catch (error: any) {
    console.error("Image Search API Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
