import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const userSelect = {
  id: true, name: true, email: true, role: true,
  department: true, image: true, emailVerified: true, createdAt: true, updatedAt: true,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin")
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin")
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (body.email && body.email !== existing.email) {
      const emailConflict = await prisma.user.findUnique({ where: { email: body.email } });
      if (emailConflict)
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const updateData: Prisma.UserUpdateInput = {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
      ...(body.role && { role: body.role }),
      ...(body.department !== undefined && { department: body.department }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.emailVerified !== undefined && {
        emailVerified: body.emailVerified ? new Date(body.emailVerified) : null,
      }),
    };

    if (body.password) updateData.password = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.update({ where: { id }, data: updateData, select: userSelect });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token || token.role !== "admin")
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    if (id === token.sub)
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
