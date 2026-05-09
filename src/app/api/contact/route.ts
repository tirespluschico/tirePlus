import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  const { name, email, phone, service, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    await transporter.sendMail({
      from: `"Tires+ Website" <contact@tirespluschico.com>`,
      to: process.env.CONTACT_RECIPIENT,
      replyTo: email,
      subject: `New Contact Form: ${service || "General Inquiry"} — ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Phone:   ${phone || "Not provided"}`,
        `Service: ${service || "Not specified"}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
          <div style="background:#2f3f5a;padding:20px 24px;">
            <h2 style="color:#fff;margin:0;font-size:18px;">New Message from Tires+ Website</h2>
          </div>
          <div style="padding:24px;background:#f9fafb;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
              <tr><td style="padding:8px 0;font-weight:bold;width:90px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#cf2327;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;">Phone</td><td style="padding:8px 0;">${phone ? `<a href="tel:${phone}" style="color:#cf2327;">${phone}</a>` : "Not provided"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;">Service</td><td style="padding:8px 0;">${service || "Not specified"}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
            <p style="font-weight:bold;font-size:14px;color:#374151;margin:0 0 8px;">Message</p>
            <p style="font-size:14px;color:#374151;white-space:pre-wrap;margin:0;">${message}</p>
          </div>
          <div style="background:#121722;padding:12px 24px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">Tires+ Complete Auto Service &mdash; 624 Broadway St, Chico, CA</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
