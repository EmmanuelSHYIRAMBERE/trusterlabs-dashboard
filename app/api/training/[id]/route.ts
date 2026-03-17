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
    const program = await prisma.trainingProgram.findUnique({ where: { id } });
    if (!program)
      return NextResponse.json({ success: false, message: "Program not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: program });
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

    const existing = await prisma.trainingProgram.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Program not found" }, { status: 404 });

    const updateData: Prisma.TrainingProgramUpdateInput = {
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.enrolled !== undefined && { enrolled: body.enrolled }),
      ...(body.completed !== undefined && { completed: body.completed }),
      ...(body.deadline && { deadline: new Date(body.deadline) }),
      ...(body.status && { status: body.status }),
    };

    const program = await prisma.trainingProgram.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: program });
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
    const program = await prisma.trainingProgram.findUnique({ where: { id } });
    if (!program)
      return NextResponse.json({ success: false, message: "Program not found" }, { status: 404 });

    await prisma.trainingProgram.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Program deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
