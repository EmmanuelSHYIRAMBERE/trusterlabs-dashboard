"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConfirmDialog } from "@/components/forms";
import { useModal } from "@/hooks/useModal";
import { useCRUD } from "@/hooks/useCRUD";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { BlogStats } from "@/components/blog/BlogStats";
import { BlogTable } from "@/components/blog/BlogTable";
import { BlogPostModal } from "@/components/blog/BlogPostModal";
import { BlogPostFormData } from "@/components/blog/BlogPostForm";
import { BlogPost } from "@/components/blog/types";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formDataToPost(data: BlogPostFormData): Omit<BlogPost, "id"> {
  return {
    title: data.title,
    slug: slugify(data.title),
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    imageUrl: data.imageUrl || undefined,
    backdropImages: data.backdropImages,
    tags: data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    featured: data.featured,
    readTime: data.readTime,
    status: data.status,
    publishedDate: data.publishedDate
      ? new Date(data.publishedDate).toISOString()
      : undefined,
    createdDate: new Date().toISOString(),
    views: 0,
    engagement: 0,
  };
}

function postToFormData(post: BlogPost): BlogPostFormData {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    category: post.category,
    imageUrl: post.imageUrl ?? "",
    backdropImages: post.backdropImages ?? [],
    tags: post.tags.join(", "),
    featured: post.featured,
    readTime: post.readTime,
    status: post.status,
    publishedDate: post.publishedDate ? post.publishedDate.split("T")[0] : "",
  };
}

export default function BlogManagementPage() {
  const {
    items: posts,
    loading,
    error,
    apiCreate,
    apiUpdate,
    apiDelete,
  } = useCRUD<BlogPost>("/api/blog");
  const { openModal, closeModal, isOpen } = useModal();
  const [editData, setEditData] = useState<
    Partial<BlogPostFormData> | undefined
  >();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditData(undefined);
    openModal("post-form");
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditData(postToFormData(post));
    openModal("post-form");
  };

  const handleSubmit = async (data: BlogPostFormData) => {
    setSubmitting(true);
    if (data.id) {
      await apiUpdate(data.id, {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        imageUrl: data.imageUrl || undefined,
        backdropImages: data.backdropImages,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        featured: data.featured,
        readTime: data.readTime,
        status: data.status,
        publishedDate: data.publishedDate
          ? new Date(data.publishedDate).toISOString()
          : undefined,
      });
    } else {
      await apiCreate(formDataToPost(data) as Omit<BlogPost, "id">);
    }
    setSubmitting(false);
    closeModal("post-form");
  };

  const handleDelete = async () => {
    if (deleteId) {
      await apiDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
        className="space-y-8"
      >
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Blog Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Create, edit, and manage blog posts
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={20} /> New Post
          </motion.button>
        </div>

        <BlogStats posts={posts} />

        <BlogTable
          posts={posts}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={(id) => setDeleteId(id)}
        />
      </motion.div>

      <BlogPostModal
        isOpen={isOpen("post-form")}
        onClose={() => closeModal("post-form")}
        initial={editData}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        isDangerous
      />
    </DashboardLayout>
  );
}
