import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Simple Schema for Contacts if it doesn't exist
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
