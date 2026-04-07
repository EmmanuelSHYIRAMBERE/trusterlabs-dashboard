'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'md-editor-rt/lib/style.css';
import { ImageUploader } from './ImageUploader';

const MdEditor = dynamic(() => import('md-editor-rt').then((m) => m.MdEditor), { ssr: false });

export interface BlogPostFormData {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  backdropImages: string[];
  tags: string;
  featured: boolean;
  readTime: number;
  status: 'Draft' | 'Scheduled' | 'Published';
  publishedDate: string;
}

interface BlogPostFormProps {
  initial?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CATEGORIES = [
  'Cybersecurity Capacity Building',
  'Threat Intelligence',
  'Incident Response',
  'Security Awareness',
  'Policy & Governance',
];

const STATUS_OPTIONS = ['Draft', 'Scheduled', 'Published'];

const defaultForm: BlogPostFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: CATEGORIES[0],
  imageUrl: '',
  backdropImages: [],
  tags: '',
  featured: false,
  readTime: 5,
  status: 'Draft',
  publishedDate: '',
};

export function BlogPostForm({ initial, onSubmit, onCancel, loading }: BlogPostFormProps) {
  const [form, setForm] = useState<BlogPostFormData>({ ...defaultForm, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof BlogPostFormData, string>>>({});

  useEffect(() => {
    setForm({ ...defaultForm, ...initial });
    setErrors({});
  }, [initial]);

  const set = <K extends keyof BlogPostFormData>(key: K, value: BlogPostFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Post title"
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Excerpt</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          placeholder="Short description"
          rows={2}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Content — Markdown Editor */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Content *</label>
        <MdEditor
          modelValue={form.content}
          onChange={(v) => set('content', v)}
          style={{ height: '360px' }}
          language="en-US"
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value as BlogPostFormData['status'])}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tags & Read Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label>
          <input
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="security, threat, news"
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Read Time (min)</label>
          <input
            type="number"
            min={1}
            value={form.readTime}
            onChange={(e) => set('readTime', Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Published Date & Featured */}
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Published Date</label>
          <input
            type="date"
            value={form.publishedDate}
            onChange={(e) => set('publishedDate', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium text-foreground">Featured post</label>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Cover Image</label>
        <ImageUploader
          value={form.imageUrl}
          onChange={(url) => set('imageUrl', url as string)}
          disabled={loading}
        />
      </div>

      {/* Backdrop Images */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Backdrop Images</label>
        <ImageUploader
          multiple
          value={form.backdropImages}
          onChange={(urls) => set('backdropImages', urls as string[])}
          disabled={loading}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-border/50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving…' : initial?.id ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
