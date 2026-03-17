'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { DataTable } from '@/components/shared/DataTable';
import { blogPosts as initialPosts } from '@/lib/mockData';
import { FormModal, FormInput, FormTextarea, FormSelect, ConfirmDialog } from '@/components/forms';
import { useModal } from '@/hooks/useModal';
import { motion } from 'framer-motion';
import { Plus, Eye, MessageSquare, Edit2, Trash2, Calendar } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug?: string;
  author: string;
  content?: string;
  createdDate?: string;
  publishedDate?: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  views: number;
  engagement: number;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts as BlogPost[]);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { openModal, closeModal, isOpen } = useModal();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const draftCount = posts.filter((p) => p.status === 'Draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'Scheduled').length;
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalEngagement = posts.reduce((sum, post) => sum + post.engagement, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.author?.trim()) newErrors.author = 'Author is required';
    if (!formData.content?.trim()) newErrors.content = 'Content is required';
    if (!formData.publishedDate?.trim() && !formData.createdDate?.trim()) newErrors.publishedDate = 'Published date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      author: '',
      content: '',
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      views: 0,
      engagement: 0,
    });
    setErrors({});
    openModal('create-post');
  };

  const handleOpenEdit = (post: BlogPost) => {
    setFormData(post);
    setErrors({});
    openModal('edit-post');
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    const newPost: BlogPost = {
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      title: formData.title!,
      author: formData.author!,
      content: formData.content!,
      publishedDate: formData.publishedDate!,
      status: formData.status as BlogPost['status'],
      views: formData.views || 0,
      engagement: formData.engagement || 0,
    };
    setPosts([...posts, newPost]);
    closeModal('create-post');
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    setPosts(
      posts.map((p) =>
        p.id === formData.id
          ? { ...p, ...formData }
          : p
      )
    );
    closeModal('edit-post');
  };

  const handleDelete = () => {
    if (deleteId) {
      setPosts(posts.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header with Action */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
            <p className="text-muted-foreground mt-2">Create, edit, and manage blog posts</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            New Post
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Published', value: publishedCount, color: 'bg-green-success/10 text-green-success' },
            { label: 'Drafts', value: draftCount, color: 'bg-orange-accent/10 text-orange-accent' },
            { label: 'Scheduled', value: scheduledCount, color: 'bg-purple-secondary/10 text-purple-secondary' },
            { label: 'Total Views', value: totalViews.toLocaleString(), color: 'bg-teal-primary/10 text-teal-primary' },
            { label: 'Engagement', value: totalEngagement.toLocaleString(), color: 'bg-primary/10 text-primary' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg border border-border ${stat.color.split(' text-')[0]}`}
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color.split('bg-')[1]}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Posts Table */}
        <motion.div variants={itemVariants}>
          <Card title="All Blog Posts" subtitle="Manage your published and draft content">
            <DataTable
              columns={[
                { key: 'title', label: 'Title', width: '35%' },
                { key: 'author', label: 'Author', width: '15%' },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value: string) => (
                    <Badge
                      variant={
                        value === 'Published'
                          ? 'success'
                          : value === 'Draft'
                          ? 'default'
                          : 'info'
                      }
                      size="sm"
                    >
                      {value}
                    </Badge>
                  ),
                  width: '12%',
                },
                { key: 'publishedDate', label: 'Published', width: '12%' },
                {
                  key: 'views',
                  label: 'Views',
                  render: (value: number) => (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye size={16} />
                      <span>{value.toLocaleString()}</span>
                    </div>
                  ),
                  width: '10%',
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (value: any, row: any) => (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenEdit(row)}
                        className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteId(row.id)}
                        className="p-1 text-red-critical hover:bg-red-critical/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  ),
                  width: '8%',
                },
              ]}
              data={posts}
              maxRows={15}
            />
          </Card>
        </motion.div>

        {/* Post Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Published Posts */}
          <motion.div variants={itemVariants}>
            <Card title="Published Posts" subtitle={`${publishedCount} posts live`}>
              <div className="space-y-3">
                {posts
                  .filter((p) => p.status === 'Published')
                  .map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{post.views.toLocaleString()} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              <span>{post.engagement} interactions</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                          >
                            <Edit2 size={16} className="text-primary" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setDeleteId(post.id)}
                            className="p-1.5 hover:bg-red-critical/20 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-critical" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>

          {/* Draft & Scheduled Posts */}
          <motion.div variants={itemVariants}>
            <Card title="Draft & Scheduled" subtitle={`${draftCount + scheduledCount} posts in progress`}>
              <div className="space-y-3">
                {posts
                  .filter((p) => p.status !== 'Published')
                  .map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                            <Badge
                              variant={post.status === 'Draft' ? 'default' : 'info'}
                              size="sm"
                            >
                              {post.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{post.publishedDate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleOpenEdit(post)}
                            className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                          >
                            <Edit2 size={16} className="text-primary" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setDeleteId(post.id)}
                            className="p-1.5 hover:bg-red-critical/20 rounded transition-colors"
                          >
                            <Trash2 size={16} className="text-red-critical" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Create/Edit Post Modal */}
        <FormModal
          isOpen={isOpen('create-post') || isOpen('edit-post')}
          onClose={() => {
            closeModal('create-post');
            closeModal('edit-post');
          }}
          title={formData.id ? 'Edit Blog Post' : 'Create New Blog Post'}
          subtitle={formData.id ? 'Update post content' : 'Write and publish a new blog post'}
          size="lg"
          footer={
            <>
              <button
                onClick={() => {
                  closeModal('create-post');
                  closeModal('edit-post');
                }}
                className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={formData.id ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
              >
                {formData.id ? 'Update' : 'Publish'}
              </motion.button>
            </>
          }
        >
          <div className="space-y-4">
            <FormInput
              label="Post Title"
              name="title"
              placeholder="Enter post title"
              value={formData.title || ''}
              onChange={(value) => setFormData({ ...formData, title: value })}
              error={errors.title}
              required
            />
            <FormInput
              label="Author"
              name="author"
              placeholder="Your name"
              value={formData.author || ''}
              onChange={(value) => setFormData({ ...formData, author: value })}
              error={errors.author}
              required
            />
            <FormTextarea
              label="Content"
              name="content"
              placeholder="Write your blog post content here..."
              value={formData.content || ''}
              onChange={(value) => setFormData({ ...formData, content: value })}
              error={errors.content}
              required
              rows={6}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Published Date"
                name="publishedDate"
                type="date"
                value={formData.publishedDate || ''}
                onChange={(value) => setFormData({ ...formData, publishedDate: value })}
                error={errors.publishedDate}
                required
              />
              <FormSelect
                label="Status"
                name="status"
                options={[
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Scheduled', label: 'Scheduled' },
                  { value: 'Published', label: 'Published' },
                ]}
                value={formData.status || ''}
                onChange={(value) => setFormData({ ...formData, status: value as any })}
                required
              />
            </div>
          </div>
        </FormModal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Blog Post"
          message="Are you sure you want to delete this blog post? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />

        {/* Content Calendar */}
        <motion.div variants={itemVariants}>
          <Card title="Upcoming Publications" subtitle="Posts scheduled for publication">
            <div className="space-y-2">
              {posts
                .filter((p) => p.status === 'Scheduled')
                .map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        By {post.author} • Publishing on {post.createdDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-1 text-sm bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-1 text-sm bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              {posts.filter((p) => p.status === 'Scheduled').length === 0 && (
                <p className="text-center text-muted-foreground py-8">No scheduled posts at this time</p>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
