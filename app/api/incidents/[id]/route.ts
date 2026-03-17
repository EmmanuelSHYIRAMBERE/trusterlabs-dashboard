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
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident)
      return NextResponse.json({ success: false, message: "Incident not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: incident });
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

    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });

    const updateData: Prisma.IncidentUpdateInput = {
      ...(body.type && { type: body.type }),
      ...(body.severity && { severity: body.severity }),
      ...(body.status && { status: body.status }),
      ...(body.platform && { platform: body.platform }),
      ...(body.timestamp && { timestamp: new Date(body.timestamp) }),
      ...(body.notes !== undefined && { notes: body.notes }),
    };

    const incident = await prisma.incident.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: incident });
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
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident)
      return NextResponse.json({ success: false, message: "Incident not found" }, { status: 404 });

    await prisma.incident.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Incident deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
