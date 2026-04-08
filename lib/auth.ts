import { auth, clerkClient } from "@clerk/nextjs/server";
import { ADMIN_EMAIL } from "./utils";

/**
 * Checks if a user or a specific user ID has admin privileges.
 * 
 * @param userId - Optional Clerk user ID. If not provided, it fetches the current user's ID.
 * @returns Object containing isAdmin boolean and the user's email.
 */
export async function getAuthStatus(userId?: string | null) {
  let id = userId;
  
  if (!id) {
    const session = await auth();
    id = session.userId;
  }

  if (!id) {
    return { isAdmin: false, userId: null, email: null };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(id);
    const email = user.emailAddresses[0]?.emailAddress;
    const role = user.publicMetadata?.role as string || 'user';

    const isAdmin = email === ADMIN_EMAIL || role === 'admin';
    
    return { 
      isAdmin, 
      userId: id, 
      email,
      user 
    };
  } catch (error) {
    console.error("Auth status check failed:", error);
    return { isAdmin: false, userId: id, email: null };
  }
}

/**
 * Helper to check if the current user is the owner of an asset OR an admin.
 */
export async function canManageAsset(assetUserId: string | null) {
  const { isAdmin, userId } = await getAuthStatus();
  
  if (!userId) return false;
  if (isAdmin) return true;
  
  return userId === assetUserId;
}
