import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password)
      return NextResponse.json(
        { error: "Missing required fields: name, email, password" },
        { status: 400 },
      );

    const existing = await prisma.user.findUnique({ where: { email } });

    console.log("Received existing:--", existing);

    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || "user",
        password: hashedPassword,
      } as Parameters<typeof prisma.user.create>[0]["data"],
      select: { id: true, name: true, email: true, role: true },
    });

    console.log("Received user:--", user);

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
