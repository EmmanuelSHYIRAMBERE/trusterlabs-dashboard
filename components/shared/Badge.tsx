'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'info';
  size?: 'sm' | 'md';
  animated?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  animated = true,
}: BadgeProps) {
  const variants = {
    default: 'bg-primary/20 text-primary border-primary/30',
    critical: 'bg-red-critical/20 text-red-critical border-red-critical/30',
    warning: 'bg-orange-accent/20 text-orange-accent border-orange-accent/30',
    success: 'bg-green-success/20 text-green-success border-green-success/30',
    info: 'bg-purple-secondary/20 text-purple-secondary border-purple-secondary/30',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const Component = animated ? motion.span : 'span';

  return (
    <Component
      whileHover={animated ? { scale: 1.05 } : undefined}
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </Component>
  );
}
