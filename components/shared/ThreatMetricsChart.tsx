'use client';

import { motion } from 'framer-motion';

interface ThreatMetricsChartProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export function ThreatMetricsChart({
  critical,
  high,
  medium,
  low,
  total,
}: ThreatMetricsChartProps) {
  const metrics = [
    { label: 'Critical', value: critical, percentage: (critical / total) * 100, color: 'bg-red-critical' },
    { label: 'High', value: high, percentage: (high / total) * 100, color: 'bg-orange-accent' },
    { label: 'Medium', value: medium, percentage: (medium / total) * 100, color: 'bg-purple-secondary' },
    { label: 'Low', value: low, percentage: (low / total) * 100, color: 'bg-green-success' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: '100%', opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {metrics.map((metric) => (
        <motion.div key={metric.label} variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{metric.label}</span>
            <span className="text-sm font-bold text-primary">{metric.value}</span>
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metric.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full ${metric.color} rounded-full`}
            />
          </div>
          <span className="text-xs text-muted-foreground">{metric.percentage.toFixed(1)}%</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
