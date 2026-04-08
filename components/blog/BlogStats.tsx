'use client';

import { motion } from 'framer-motion';
import { BlogPost } from './types';

export function BlogStats({ posts }: { posts: BlogPost[] }) {
  const stats = [
    { label: 'Published', value: posts.filter((p) => p.status === 'Published').length, color: 'bg-green-success/10 text-green-success' },
    { label: 'Drafts', value: posts.filter((p) => p.status === 'Draft').length, color: 'bg-orange-accent/10 text-orange-accent' },
    { label: 'Scheduled', value: posts.filter((p) => p.status === 'Scheduled').length, color: 'bg-purple-secondary/10 text-purple-secondary' },
    { label: 'Total Views', value: posts.reduce((s, p) => s + p.views, 0).toLocaleString(), color: 'bg-teal-primary/10 text-teal-primary' },
    { label: 'Engagement', value: posts.reduce((s, p) => s + p.engagement, 0).toLocaleString(), color: 'bg-primary/10 text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`p-4 rounded-lg border border-border ${stat.color.split(' ')[0]}`}
        >
          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
