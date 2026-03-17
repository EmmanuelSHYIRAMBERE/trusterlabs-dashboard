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
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Prisma.InternshipApplicationWhereInput = {};
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      prisma.internshipApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appliedDate: "desc" },
      }),
      prisma.internshipApplication.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: applications,
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
    const { name, email, position, status, rating, notes } = body;

    if (!name || !email || !position)
      return NextResponse.json({ error: "Missing required fields: name, email, position" }, { status: 400 });

    const application = await prisma.internshipApplication.create({
      data: {
        name,
        email,
        position,
        status: status || "New Application",
        rating: rating ?? 0,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
