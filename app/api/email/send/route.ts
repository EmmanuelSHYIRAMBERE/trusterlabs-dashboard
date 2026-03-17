import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import prisma from "../../../../prisma/client";

interface EmailRequest {
  email: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = (await req.json()) as EmailRequest;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate verification token
    const token = crypto.randomInt(100000, 999999).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    // TrusterLabs-branded email template
    const message = {
      from: `"TrusterLabs" <${process.env.GOOGLE_EMAIL}>`,
      to: email,
      subject: "Your TrusterLabs Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e2e8f0; margin: 0; padding: 0; background-color: #0d0d14; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f1923 0%, #0d1f2d 100%); padding: 32px 20px; text-align: center; border-radius: 12px 12px 0 0; border-bottom: 2px solid #14b8a6; }
            .logo-text { font-size: 26px; font-weight: 800; letter-spacing: 1px; color: #14b8a6; }
            .logo-dot { color: #fa9c52; }
            .tagline { font-size: 12px; color: #64748b; margin-top: 4px; letter-spacing: 2px; text-transform: uppercase; }
            .content { padding: 36px 30px; background-color: #111827; border: 1px solid #1e293b; border-top: none; }
            .greeting { font-size: 18px; font-weight: 600; color: #f1f5f9; margin-bottom: 12px; }
            .body-text { font-size: 14px; color: #94a3b8; margin-bottom: 24px; }
            .code-wrapper { background: #0f1923; border: 1px solid #14b8a6; border-radius: 10px; padding: 24px; text-align: center; margin: 24px 0; }
            .code-label { font-size: 11px; color: #64748b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
            .code { font-size: 36px; letter-spacing: 8px; color: #14b8a6; font-weight: 800; font-family: 'Courier New', monospace; }
            .expiry { font-size: 12px; color: #fa9c52; margin-top: 10px; }
            .divider { border: none; border-top: 1px solid #1e293b; margin: 24px 0; }
            .warning { font-size: 12px; color: #64748b; background: #0f1923; border-left: 3px solid #fa9c52; padding: 10px 14px; border-radius: 0 6px 6px 0; }
            .signature { font-size: 14px; color: #94a3b8; margin-top: 24px; }
            .footer { margin-top: 0; padding: 20px; text-align: center; font-size: 11px; color: #475569; background-color: #0d0d14; border-radius: 0 0 12px 12px; border: 1px solid #1e293b; border-top: none; }
            .footer a { color: #14b8a6; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-text">Truster<span class="logo-dot">Labs</span></div>
              <div class="tagline">Cybersecurity Dashboard</div>
            </div>
            <div class="content">
              <p class="greeting">Hello, ${name?.split(" ")[0] || "there"} 👋</p>
              <p class="body-text">You requested a verification code to access your TrusterLabs account. Use the code below to complete your authentication.</p>

              <div class="code-wrapper">
                <div class="code-label">Your verification code</div>
                <div class="code">${token}</div>
                <div class="expiry">⏱ Expires in 30 minutes</div>
              </div>

              <hr class="divider" />

              <div class="warning">
                🔒 If you did not request this code, please ignore this email. Your account remains secure.
              </div>

              <p class="signature">Stay secure,<br/><strong style="color: #14b8a6;">The TrusterLabs Team</strong></p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} TrusterLabs. All rights reserved.<br/>
              This is an automated security email — please do not reply.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(message);

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Save new token in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: expiryTime,
      },
    });

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
