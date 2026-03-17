import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../../../prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin")
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role");
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, department: true, image: true, emailVerified: true, createdAt: true, updatedAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin")
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, password, role, department, image } = body;

    if (!name || !email || !password)
      return NextResponse.json({ error: "Missing required fields: name, email, password" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, role: role || "user", department, image, password: hashedPassword } as Prisma.UserCreateInput,
      select: { id: true, name: true, email: true, role: true, department: true, image: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
