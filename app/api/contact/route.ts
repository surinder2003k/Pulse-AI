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

    if (!isTest) {
      if (!name || !email || !message) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      await connectDB();
      const newContact = new Contact({ name, email, subject, message });
      await newContact.save();
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.verify();
    } catch (verifyError: any) {
      console.error("Nodemailer Verify Error:", verifyError);
      return NextResponse.json({ success: false, error: verifyError.message }, { status: 500 });
    }

    // Professional HTML Template for User
    const userHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; }
            .logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; margin: 0; }
            .logo span { color: #94a3b8; }
            .content { padding: 40px; color: #334155; line-height: 1.6; }
            .greeting { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
            .subject-box { background-color: #f8fafc; border-radius: 12px; padding: 16px 20px; border-left: 4px solid #ef4444; margin: 24px 0; }
            .subject-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 4px; }
            .subject-text { font-size: 16px; font-weight: 600; color: #0f172a; }
            .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer-text { font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }
            .btn { display: inline-block; padding: 14px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">Pulse <span>AI</span></h1>
            </div>
            <div class="content">
              <div class="greeting">Transmission Logged</div>
              <p>Hi <b>${name}</b>,</p>
              <p>We've successfully received your inquiry through our digital channel. Our editorial board and system architects are currently reviewing your request.</p>
              
              <div class="subject-box">
                <div class="subject-label">Asset Classification</div>
                <div class="subject-text">${subject}</div>
              </div>

              <p>No further action is required at this time. We will reach out via this email address once the analysis is complete.</p>
              
              <a href="https://pulse-blog-ai.vercel.app" class="btn">Return to Network</a>
            </div>
            <div class="footer">
              <div class="footer-text">Pulse AI Protocol 2.0 // Node: Global_Editor</div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Professional HTML Template for Admin
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; border-radius: 15px; padding: 30px;">
        <h2 style="color: #ef4444; text-transform: uppercase; letter-spacing: 2px;">New Contact Alert</h2>
        <p><b>User:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin-top: 20px;">
          ${message}
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Pulse AI" <${process.env.EMAIL_USER}>`,
      to: isTest ? (email || "geniecutsai@gmail.com") : email,
      subject: isTest ? "Pulse AI | Connection Test" : `Re: ${subject} | Pulse AI`,
      html: userHtml
    };

    const adminMailOptions = !isTest ? {
      from: `"System Alert" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🚨 New Contact: ${name}`,
      html: adminHtml
    } : null;

    const emailPromises = [transporter.sendMail(mailOptions)];
    if (adminMailOptions) emailPromises.push(transporter.sendMail(adminMailOptions));

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true, message: "Transmission complete" });
  } catch (error: any) {
    console.error("Critical Contact API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
