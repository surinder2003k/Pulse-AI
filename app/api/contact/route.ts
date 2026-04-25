import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
// @ts-ignore
import nodemailer from "nodemailer";

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
    const { name, email, subject, message, isTest } = body;

    // 1. Save to MongoDB (unless it's a pure test)
    if (!isTest) {
      if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      await connectDB();
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
    }

    // 2. Setup Nodemailer with more robust config
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Verify connection configuration
    try {
      await transporter.verify();
    } catch (verifyError: any) {
      console.error("Nodemailer Verify Error:", verifyError);
      return NextResponse.json({ 
        success: false, 
        message: "Email configuration incorrect", 
        error: verifyError.message 
      }, { status: 500 });
    }

    // 4. Send Emails
    const mailOptions = isTest ? {
      from: `Pulse AI <${process.env.EMAIL_USER}>`,
      to: email || "geniecutsai@gmail.com",
      subject: "Pulse AI - Connection Test",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 15px;">
          <h1 style="color: #ef4444;">System Test Successful</h1>
          <p>This is a test transmission from the Pulse AI Network.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p>If you received this, your Email SMTP is working perfectly.</p>
        </div>
      `
    } : {
      from: `Pulse AI <${process.env.EMAIL_USER}>`,
      to: email, // Send confirmation to user
      subject: `Transmission Received: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 30px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #000;">Pulse AI Network</h2>
          <p>Hi ${name},</p>
          <p>We've received your message regarding <strong>"${subject}"</strong>.</p>
          <p>Our team will review the data and contact you via this channel.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #999;">REFERENCE_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      `
    };

    const adminMailOptions = !isTest ? {
      from: `Pulse AI Alert <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `NEW CONTACT: ${name}`,
      text: `New message from ${name} (${email}):\n\nSubject: ${subject}\n\nMessage: ${message}`
    } : null;

    const emailPromises = [transporter.sendMail(mailOptions)];
    if (adminMailOptions) emailPromises.push(transporter.sendMail(adminMailOptions));

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true, message: "Transmission complete" });
  } catch (error: any) {
    console.error("Critical Contact API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal transmission failure", 
      error: error.message 
    }, { status: 500 });
  }
}
