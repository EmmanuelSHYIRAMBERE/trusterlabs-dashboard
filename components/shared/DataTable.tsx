'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  maxRows?: number;
}

export function DataTable({ columns, data, onRowClick, maxRows = 10 }: DataTableProps) {
  const displayData = data.slice(0, maxRows);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground"
              >
                {column.label}
              </th>
            ))}
            {onRowClick && <th className="w-8" />}
          </tr>
        </thead>
        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {displayData.map((row, idx) => (
            <motion.tr
              key={idx}
              variants={rowVariants}
              whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-border/50 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-primary/5' : ''
              }`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-foreground">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {onRowClick && (
                <td className="px-4 py-3">
                  <ChevronRight size={16} className="text-muted-foreground" />
                </td>
              )}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
