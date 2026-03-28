import { NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/utils";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function DELETE(req: Request) {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (userEmail !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
