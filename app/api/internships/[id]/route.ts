import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const application = await prisma.internshipApplication.findUnique({ where: { id } });
    if (!application)
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: application });
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
  if (!token)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();

    const existing = await prisma.internshipApplication.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const updateData: Prisma.InternshipApplicationUpdateInput = {
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
      ...(body.position && { position: body.position }),
      ...(body.status && { status: body.status }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.notes !== undefined && { notes: body.notes }),
    };

    const application = await prisma.internshipApplication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: application });
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
  if (!token)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const application = await prisma.internshipApplication.findUnique({ where: { id } });
    if (!application)
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });

    await prisma.internshipApplication.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
