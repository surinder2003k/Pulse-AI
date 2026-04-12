import Post from "@/models/Post";
import { getXylosLinks } from "./external-links";
import connectDB from "./mongodb";

export interface LinkContext {
  internal: { title: string; url: string }[];
  external: string[];
}

/**
 * Gathers a combined context of internal and external links for AI post generation.
 */
export async function getLinkingContext(): Promise<LinkContext> {
  await connectDB();

  try {
    // 1. Fetch random internal posts for contextual linking
    const internalPosts = await Post.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("title slug")
      .lean();

    // Pick 5 random ones to avoid overloading the AI prompt
    const randomInternal = internalPosts
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((p: any) => ({
        title: p.title,
        url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/blog/${p.slug}`
      }));

    // 2. Fetch external ecosystem links
    const external = await getXylosLinks();

    return {
      internal: randomInternal,
      external: external.slice(0, 5), // Same limit for balance
    };
  } catch (error) {
    console.error("[Linking] Error gathering context:", error);
    return { internal: [], external: [] };
  }
}
