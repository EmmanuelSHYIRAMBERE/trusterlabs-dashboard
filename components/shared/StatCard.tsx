'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon,
  variant = 'default',
}: StatCardProps) {
  const variants = {
    default: 'bg-card border-border hover:border-primary/50',
    critical: 'bg-red-critical/10 border-red-critical/30 hover:border-red-critical/50',
    warning: 'bg-orange-accent/10 border-orange-accent/30 hover:border-orange-accent/50',
    success: 'bg-green-success/10 border-green-success/30 hover:border-green-success/50',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', damping: 15 }}
      className={`p-6 rounded-lg border transition-all duration-200 ${variants[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 mt-3">
              {isPositive ? (
                <TrendingUp size={16} className="text-green-success" />
              ) : (
                <TrendingDown size={16} className="text-red-critical" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-success' : 'text-red-critical'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 text-primary opacity-20">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
