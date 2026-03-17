'use client';

import { motion } from 'framer-motion';
import { StatCard } from './StatCard';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'critical' | 'warning' | 'success';
}

interface StatsOverviewProps {
  stats: Stat[];
  columns?: 1 | 2 | 3 | 4;
}

export function StatsOverview({ stats, columns = 4 }: StatsOverviewProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${gridClass[columns]} gap-4`}
    >
      {stats.map((stat, index) => (
        <motion.div key={index} variants={itemVariants}>
          <StatCard
            label={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            variant={stat.variant}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
