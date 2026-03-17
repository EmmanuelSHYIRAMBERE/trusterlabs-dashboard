'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineChartComponentProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xKey?: string;
  stroke?: string;
  height?: number;
}

export function LineChartComponent({
  data,
  dataKey,
  xKey = 'date',
  stroke = '#14b8a6',
  height = 300,
}: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stroke} stopOpacity={0.3} />
            <stop offset="95%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
        <XAxis
          dataKey={xKey}
          stroke="rgba(255, 255, 255, 0.4)"
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke="rgba(255, 255, 255, 0.4)" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(20, 20, 30, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: '#fff',
          }}
          cursor={{ stroke: 'rgba(139, 92, 246, 0.2)' }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
