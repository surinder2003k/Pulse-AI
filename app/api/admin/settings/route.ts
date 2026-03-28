import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { ADMIN_EMAIL } from "@/lib/utils";

export async function GET() {
  await connectDB();
  
  // Fetch existing settings or create default
  let currentSettings = await Settings.findOne();
  if (!currentSettings) {
    currentSettings = await Settings.create({
      automationEnabled: true,
      automationCategory: "Technology"
    });
  }
  
  return NextResponse.json(currentSettings);
}

export async function PATCH(req: Request) {
  // Authentication check
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (userEmail !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { automationEnabled, automationCategory } = await req.json();

    await connectDB();
    
    // Upsert Settings
    let currentSettings = await Settings.findOne();
    if (!currentSettings) {
      currentSettings = new Settings({});
    }

    if (automationEnabled !== undefined) {
      currentSettings.automationEnabled = automationEnabled;
    }
    
    if (automationCategory) {
      currentSettings.automationCategory = automationCategory;
    }

    await currentSettings.save();

    return NextResponse.json(currentSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
