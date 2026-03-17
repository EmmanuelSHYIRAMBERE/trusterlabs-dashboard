'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { DataTable } from '@/components/shared/DataTable';
import { FormModal, FormInput, FormTextarea, FormSelect, ConfirmDialog } from '@/components/forms';
import { useModal } from '@/hooks/useModal';
import { useCRUD } from '@/hooks/useCRUD';
import { motion } from 'framer-motion';
import { Plus, Eye, MessageSquare, Edit2, Trash2, Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  imageUrl?: string;
  tags: string[];
  featured: boolean;
  readTime: number;
  status: 'Published' | 'Draft' | 'Scheduled';
  publishedDate?: string;
  createdDate: string;
  views: number;
  engagement: number;
  author?: { id: string; name: string; image?: string };
}

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogManagementPage() {
  const { items: posts, loading, error, apiCreate, apiUpdate, apiDelete } = useCRUD<BlogPost>('/api/blog');
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { openModal, closeModal, isOpen } = useModal();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const draftCount = posts.filter((p) => p.status === 'Draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'Scheduled').length;
  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalEngagement = posts.reduce((s, p) => s + p.engagement, 0);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.content?.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({ title: '', content: '', excerpt: '', category: 'Cybersecurity Capacity Building', tags: [], featured: false, readTime: 5, status: 'Draft', views: 0, engagement: 0 });
    setErrors({});
    openModal('create-post');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setFormData({ ...post, publishedDate: post.publishedDate ? post.publishedDate.split('T')[0] : '' });
    setErrors({});
    openModal('edit-post');
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    await apiCreate({
      title: formData.title!,
      slug: slugify(formData.title!),
      excerpt: formData.excerpt,
      content: formData.content!,
      category: formData.category || 'Cybersecurity Capacity Building',
      tags: formData.tags || [],
      featured: formData.featured ?? false,
      readTime: formData.readTime ?? 5,
      status: formData.status as BlogPost['status'],
      publishedDate: formData.publishedDate ? new Date(formData.publishedDate).toISOString() : undefined,
      createdDate: new Date().toISOString(),
      views: 0,
      engagement: 0,
    });
    closeModal('create-post');
  };

  const handleUpdate = async () => {
    if (!validateForm() || !formData.id) return;
    await apiUpdate(formData.id, {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      featured: formData.featured,
      readTime: formData.readTime,
      status: formData.status,
      publishedDate: formData.publishedDate ? new Date(formData.publishedDate).toISOString() : undefined,
    });
    closeModal('edit-post');
  };

  const handleDelete = async () => {
    if (deleteId) {
      await apiDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {error && (
          <div className="p-4 rounded-lg bg-red-critical/10 border border-red-critical/30 text-red-critical text-sm">{error}</div>
        )}

        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
            <p className="text-muted-foreground mt-2">Create, edit, and manage blog posts</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={20} /> New Post
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Published', value: publishedCount, color: 'bg-green-success/10 text-green-success' },
            { label: 'Drafts', value: draftCount, color: 'bg-orange-accent/10 text-orange-accent' },
            { label: 'Scheduled', value: scheduledCount, color: 'bg-purple-secondary/10 text-purple-secondary' },
            { label: 'Total Views', value: totalViews.toLocaleString(), color: 'bg-teal-primary/10 text-teal-primary' },
            { label: 'Engagement', value: totalEngagement.toLocaleString(), color: 'bg-primary/10 text-primary' },
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg border border-border ${stat.color.split(' ')[0]}`}
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Posts Table */}
        <motion.div variants={itemVariants}>
          <Card title="All Blog Posts" subtitle="Manage your published and draft content">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading posts...</div>
            ) : (
              <DataTable
                columns={[
                  { key: 'title', label: 'Title', width: '35%' },
                  { key: 'category', label: 'Category', width: '18%' },
                  {
                    key: 'status', label: 'Status', width: '12%',
                    render: (value: string) => (
                      <Badge variant={value === 'Published' ? 'success' : value === 'Draft' ? 'default' : 'info'} size="sm">{value}</Badge>
                    ),
                  },
                  {
                    key: 'publishedDate', label: 'Published', width: '12%',
                    render: (value: string) => value ? new Date(value).toLocaleDateString() : '—',
                  },
                  {
                    key: 'views', label: 'Views', width: '10%',
                    render: (value: number) => (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye size={16} /><span>{value.toLocaleString()}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'actions', label: 'Actions', width: '8%',
                    render: (_: unknown, row: BlogPost) => (
                      <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenEdit(row)}
                          className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"><Edit2 size={16} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setDeleteId(row.id)}
                          className="p-1 text-red-critical hover:bg-red-critical/10 rounded transition-colors"><Trash2 size={16} /></motion.button>
                      </div>
                    ),
                  },
                ]}
                data={posts}
                maxRows={15}
              />
            )}
          </Card>
        </motion.div>

        {/* Published / Draft columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Card title="Published Posts" subtitle={`${publishedCount} posts live`}>
              <div className="space-y-3">
                {posts.filter((p) => p.status === 'Published').map((post, idx) => (
                  <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><Eye size={14} /><span>{post.views.toLocaleString()} views</span></div>
                          <div className="flex items-center gap-1"><MessageSquare size={14} /><span>{post.engagement} interactions</span></div>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleOpenEdit(post)} className="p-1.5 hover:bg-primary/20 rounded transition-colors">
                          <Edit2 size={16} className="text-primary" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteId(post.id)} className="p-1.5 hover:bg-red-critical/20 rounded transition-colors">
                          <Trash2 size={16} className="text-red-critical" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {publishedCount === 0 && <p className="text-center text-muted-foreground py-8">No published posts</p>}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card title="Draft & Scheduled" subtitle={`${draftCount + scheduledCount} posts in progress`}>
              <div className="space-y-3">
                {posts.filter((p) => p.status !== 'Published').map((post, idx) => (
                  <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h4>
                          <Badge variant={post.status === 'Draft' ? 'default' : 'info'} size="sm">{post.status}</Badge>
                        </div>
                        {post.publishedDate && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar size={14} /><span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => handleOpenEdit(post)} className="p-1.5 hover:bg-primary/20 rounded transition-colors">
                          <Edit2 size={16} className="text-primary" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDeleteId(post.id)} className="p-1.5 hover:bg-red-critical/20 rounded transition-colors">
                          <Trash2 size={16} className="text-red-critical" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {draftCount + scheduledCount === 0 && <p className="text-center text-muted-foreground py-8">No drafts or scheduled posts</p>}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Publications */}
        <motion.div variants={itemVariants}>
          <Card title="Upcoming Publications" subtitle="Posts scheduled for publication">
            <div className="space-y-2">
              {posts.filter((p) => p.status === 'Scheduled').map((post, idx) => (
                <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{post.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {post.author?.name ?? 'Unknown'} • Publishing on {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleOpenEdit(post)}
                      className="px-3 py-1 text-sm bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">Edit</motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setDeleteId(post.id)}
                      className="px-3 py-1 text-sm bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors">Cancel</motion.button>
                  </div>
                </motion.div>
              ))}
              {scheduledCount === 0 && <p className="text-center text-muted-foreground py-8">No scheduled posts at this time</p>}
            </div>
          </Card>
        </motion.div>

        {/* Create/Edit Modal */}
        <FormModal
          isOpen={isOpen('create-post') || isOpen('edit-post')}
          onClose={() => { closeModal('create-post'); closeModal('edit-post'); }}
          title={formData.id ? 'Edit Blog Post' : 'Create New Blog Post'}
          subtitle={formData.id ? 'Update post content' : 'Write and publish a new blog post'}
          size="lg"
          footer={
            <>
              <button onClick={() => { closeModal('create-post'); closeModal('edit-post'); }}
                className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border transition-colors">Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={formData.id ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors">
                {formData.id ? 'Update' : 'Publish'}
              </motion.button>
            </>
          }
        >
          <div className="space-y-4">
            <FormInput label="Post Title" name="title" placeholder="Enter post title"
              value={formData.title || ''} onChange={(v) => setFormData({ ...formData, title: v })} error={errors.title} required />
            <FormInput label="Excerpt" name="excerpt" placeholder="Short description"
              value={formData.excerpt || ''} onChange={(v) => setFormData({ ...formData, excerpt: v })} />
            <FormTextarea label="Content" name="content" placeholder="Write your blog post content here..."
              value={formData.content || ''} onChange={(v) => setFormData({ ...formData, content: v })} error={errors.content} required rows={6} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Category" name="category" placeholder="e.g., Cybersecurity"
                value={formData.category || ''} onChange={(v) => setFormData({ ...formData, category: v })} />
              <FormInput label="Read Time (min)" name="readTime" type="number" min="1"
                value={String(formData.readTime ?? 5)} onChange={(v) => setFormData({ ...formData, readTime: parseInt(v) || 5 })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Published Date" name="publishedDate" type="date"
                value={formData.publishedDate || ''} onChange={(v) => setFormData({ ...formData, publishedDate: v })} />
              <FormSelect label="Status" name="status"
                options={[{ value: 'Draft', label: 'Draft' }, { value: 'Scheduled', label: 'Scheduled' }, { value: 'Published', label: 'Published' }]}
                value={formData.status || ''} onChange={(v) => setFormData({ ...formData, status: v as BlogPost['status'] })} required />
            </div>
          </div>
        </FormModal>

        <ConfirmDialog
          isOpen={deleteId !== null} title="Delete Blog Post"
          message="Are you sure you want to delete this blog post? This action cannot be undone."
          confirmText="Delete" cancelText="Cancel" isDangerous={true}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)}
        />
      </motion.div>
    </DashboardLayout>
  );
}
