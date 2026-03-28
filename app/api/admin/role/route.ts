import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ADMIN_EMAIL } from "@/lib/utils";

export async function PATCH(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only the primary super admin can change roles
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Only the primary administrator can manage roles" }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const client = await clerkClient();
    
    // Safety check: Cannot demote the primary admin
    const targetUser = await client.users.getUser(userId);
    if (targetUser.emailAddresses[0]?.emailAddress === ADMIN_EMAIL && role === 'user') {
      return NextResponse.json({ error: "Cannot demote the primary administrator" }, { status: 400 });
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role
      }
    });

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
