'use client';

import { FormModal } from '@/components/forms/FormModal';
import { BlogPostForm, BlogPostFormData } from './BlogPostForm';

interface BlogPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  loading?: boolean;
}

export function BlogPostModal({ isOpen, onClose, initial, onSubmit, loading }: BlogPostModalProps) {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={initial?.id ? 'Edit Post' : 'New Post'}
      size="2xl"
    >
      <BlogPostForm
        initial={initial}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </FormModal>
  );
}
