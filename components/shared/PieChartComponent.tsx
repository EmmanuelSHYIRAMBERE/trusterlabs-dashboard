'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = [
  '#14b8a6', // teal-primary
  '#fa9c52', // orange-accent
  '#8b5cf6', // purple-secondary
  '#4ade80', // green-success
];

export function PieChartComponent({
  data,
  colors = DEFAULT_COLORS,
  height = 300,
}: PieChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={true}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(20, 20, 30, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value) => `${value} threats`}
        />
        <Legend
          wrapperStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
          formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
