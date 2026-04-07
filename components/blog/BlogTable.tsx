'use client';

import { motion } from 'framer-motion';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';
import { DataTable } from '@/components/shared/DataTable';
import { Card } from '@/components/shared/Card';
import Link from 'next/link';
import { BlogPost } from './types';

interface BlogTableProps {
  posts: BlogPost[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export function BlogTable({ posts, loading, onEdit, onDelete }: BlogTableProps) {
  return (
    <Card title="All Blog Posts" subtitle="Manage your published and draft content">
      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading posts…</div>
      ) : (
        <DataTable
          columns={[
            { key: 'title', label: 'Title', width: '35%' },
            { key: 'category', label: 'Category', width: '18%' },
            {
              key: 'status', label: 'Status', width: '12%',
              render: (value: string) => (
                <Badge variant={value === 'Published' ? 'success' : value === 'Draft' ? 'default' : 'info'} size="sm">
                  {value}
                </Badge>
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
                  <Eye size={14} /><span>{value.toLocaleString()}</span>
                </div>
              ),
            },
            {
              key: 'actions', label: 'Actions', width: '13%',
              render: (_: unknown, row: BlogPost) => (
                <div className="flex gap-2">
                  <Link href={`/blog/${row.id}`}>
                    <motion.span whileHover={{ scale: 1.1 }} className="inline-flex p-1 text-muted-foreground hover:bg-border/50 rounded transition-colors cursor-pointer">
                      <Eye size={15} />
                    </motion.span>
                  </Link>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => onEdit(row)}
                    className="p-1 text-primary hover:bg-primary/10 rounded transition-colors">
                    <Edit2 size={15} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => onDelete(row.id)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              ),
            },
          ]}
          data={posts}
          maxRows={15}
        />
      )}
    </Card>
  );
}
