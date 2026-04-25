import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
// @ts-ignore
import nodemailer from "nodemailer";

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

    // 1. Save to MongoDB
    await connectDB();
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // 2. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Email to Admin (You)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Pulse AI Contact: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ef4444;">New Transmission Received</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    // 4. Confirmation Email to User
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `We've received your message - Pulse AI`,
      html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #eee; border-radius: 20px; max-width: 600px; margin: auto;">
          <h1 style="color: #000; letter-spacing: -1px;">Pulse <span style="color: #ccc;">AI</span></h1>
          <p style="font-size: 16px; color: #555;">Hi ${name},</p>
          <p style="font-size: 16px; color: #555;">Thank you for reaching out to Pulse AI. Our editorial board has received your transmission regarding <strong>"${subject}"</strong>.</p>
          <p style="font-size: 16px; color: #555;">We will review your inquiry and get back to you shortly.</p>
          <br />
          <p style="font-size: 12px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">Pulse AI Protocol 2.0 // Automating Intelligence</p>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return NextResponse.json({ success: true, message: "Message sent and emails delivered" });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    // Even if email fails, we saved it to DB, so we return 200 but log error
    return NextResponse.json({ 
      success: true, 
      message: "Saved to DB, but email failed", 
      emailError: error.message 
    });
  }
}
