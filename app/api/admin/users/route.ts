import { NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/utils";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const users = await client.users.getUserList();
    
    const formattedUsers = users.data.map(u => ({
      id: u.id,
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "No Name",
      email: u.emailAddresses[0]?.emailAddress || "No Email",
      role: (u.publicMetadata?.role as string) || "user",
      joined: new Date(u.createdAt).toISOString().split('T')[0]
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    console.error("Fetch users error:", error.message);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // Safety check: Cannot delete yourself
    if (user?.id === userId) {
      return NextResponse.json({ error: "Admins cannot remove their own access protocol" }, { status: 400 });
    }

    const client = await clerkClient();
    
    // Safety check: Cannot delete the primary super admin
    const targetUser = await client.users.getUser(userId);
    const targetEmail = targetUser.emailAddresses[0]?.emailAddress;
    
    if (targetEmail === ADMIN_EMAIL || targetEmail === "xyzg135@gmail.com") {
      return NextResponse.json({ error: "Root Administrator asset cannot be purged" }, { status: 403 });
    }

    await client.users.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Deletion error:", error.message);
    return NextResponse.json({ error: "Failed to delete user: " + error.message }, { status: 500 });
  }
}
