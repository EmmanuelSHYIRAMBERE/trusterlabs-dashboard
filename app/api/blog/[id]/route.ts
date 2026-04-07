import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, image: true } } },
    });
    if (!post)
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: post });
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

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (body.slug && body.slug !== existing.slug) {
      const slugConflict = await prisma.blogPost.findUnique({ where: { slug: body.slug } });
      if (slugConflict)
        return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
    }

    const updateData: Prisma.BlogPostUpdateInput = {
      ...(body.title && { title: body.title }),
      ...(body.slug && { slug: body.slug }),
      ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
      ...(body.content && { content: body.content }),
      ...(body.category && { category: body.category }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.backdropImages !== undefined && { backdropImages: body.backdropImages }),
      ...(body.tags && { tags: body.tags }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.readTime && { readTime: body.readTime }),
      ...(body.status && { status: body.status }),
      ...(body.publishedDate !== undefined && {
        publishedDate: body.publishedDate ? new Date(body.publishedDate) : null,
      }),
    };

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({ success: true, data: post });
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
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
