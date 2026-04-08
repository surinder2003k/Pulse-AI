import { NextResponse } from "next/server";
import { getAuthStatus } from "@/lib/auth";

export async function GET() {
  try {
    const status = await getAuthStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ isAdmin: false, userId: null, email: null }, { status: 500 });
  }
}
