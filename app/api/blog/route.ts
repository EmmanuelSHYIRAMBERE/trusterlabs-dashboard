import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../../../prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured) where.featured = featured === "true";

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdDate: "desc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
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
    const { title, slug, excerpt, content, category, imageUrl, backdropImages, tags, featured, readTime, status, publishedDate } = body;

    if (!title || !slug || !content)
      return NextResponse.json({ error: "Missing required fields: title, slug, content" }, { status: 400 });

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing)
      return NextResponse.json({ error: "Slug already in use" }, { status: 400 });

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        imageUrl,
        backdropImages: backdropImages || [],
        tags: tags || [],
        featured: featured ?? false,
        readTime: readTime ?? 5,
        status: status || "Draft",
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        authorId: token.sub as string,
      },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
