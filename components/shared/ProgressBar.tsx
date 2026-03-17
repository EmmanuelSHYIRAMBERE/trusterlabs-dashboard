'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const variants = {
    default: 'bg-primary',
    success: 'bg-green-success',
    warning: 'bg-orange-accent',
    critical: 'bg-red-critical',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <p className="text-sm font-medium text-foreground">{label}</p>}
          {showPercentage && <p className="text-sm text-muted-foreground">{Math.round(percentage)}%</p>}
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-muted rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full ${variants[variant]} rounded-full`}
        />
      </div>
    </div>
  );
}
