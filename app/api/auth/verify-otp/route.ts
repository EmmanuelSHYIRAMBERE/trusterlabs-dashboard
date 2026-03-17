import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the used token on successful verification
    if (!updatedUser || !updatedUser.emailVerified) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
