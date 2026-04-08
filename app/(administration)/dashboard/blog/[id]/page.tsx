"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "md-editor-rt/lib/preview.css";
import { Badge } from "@/components/shared/Badge";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Eye, User } from "lucide-react";
import Image from "next/image";

const MdPreview = dynamic(
  () => import("md-editor-rt").then((m) => m.MdPreview),
  { ssr: false },
);

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  imageUrl?: string;
  backdropImages: string[];
  tags: string[];
  featured: boolean;
  readTime: number;
  status: string;
  publishedDate?: string;
  createdDate: string;
  views: number;
  engagement: number;
  author?: { id: string; name: string; image?: string };
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blog/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPost(json.data);
        else setError(json.message ?? "Post not found");
      })
      .catch(() => setError("Failed to load post"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
        {error ?? "Post not found"}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> Back to Blog
      </button>

      {/* Cover image */}
      {post.imageUrl && (
        <div className="relative w-full h-72 rounded-xl overflow-hidden border border-border">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Meta */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              post.status === "Published"
                ? "success"
                : post.status === "Draft"
                  ? "default"
                  : "info"
            }
            size="sm"
          >
            {post.status}
          </Badge>
          <span className="text-xs text-muted-foreground bg-border/50 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
          {post.featured && (
            <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>

        {post.excerpt && (
          <p className="text-muted-foreground text-lg">{post.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.author && (
            <span className="flex items-center gap-1">
              <User size={14} />
              {post.author.name}
            </span>
          )}
          {post.publishedDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.publishedDate).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.readTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {post.views.toLocaleString()} views
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Markdown content */}
      <div className="rounded-xl border border-border overflow-hidden">
        <MdPreview modelValue={post.content} className="p-2" />
      </div>

      {/* Backdrop images */}
      {post.backdropImages?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {post.backdropImages.map((url, i) => (
              <div
                key={i}
                className="relative h-48 rounded-lg overflow-hidden border border-border"
              >
                <Image
                  src={url}
                  alt={`Backdrop ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
