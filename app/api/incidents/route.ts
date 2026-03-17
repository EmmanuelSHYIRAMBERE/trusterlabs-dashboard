import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../../../prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Prisma.IncidentWhereInput = {};
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
      }),
      prisma.incident.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: incidents,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { type, severity, status, platform, timestamp, notes } = body;

    if (!type || !platform)
      return NextResponse.json({ error: "Missing required fields: type, platform" }, { status: 400 });

    const incident = await prisma.incident.create({
      data: {
        type,
        severity: severity || "Medium",
        status: status || "Under Review",
        platform,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        notes,
      },
    });

    return NextResponse.json({ success: true, data: incident }, { status: 201 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
