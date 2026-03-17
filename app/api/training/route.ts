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

    const where: Prisma.TrainingProgramWhereInput = {};
    if (status) where.status = status;

    const [programs, total] = await Promise.all([
      prisma.trainingProgram.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.trainingProgram.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: programs,
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
    const { name, description, enrolled, completed, deadline, status } = body;

    if (!name || !description || !deadline)
      return NextResponse.json({ error: "Missing required fields: name, description, deadline" }, { status: 400 });

    const program = await prisma.trainingProgram.create({
      data: {
        name,
        description,
        enrolled: enrolled ?? 0,
        completed: completed ?? 0,
        deadline: new Date(deadline),
        status: status || "Active",
      },
    });

    return NextResponse.json({ success: true, data: program }, { status: 201 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
