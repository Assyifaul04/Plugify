'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GamePlatform } from '@prisma/client';

interface PlatformData {
  platform: GamePlatform;
  count: number;
}

const PLATFORM_LABELS: Record<GamePlatform, string> = {
  JAVA: 'Java',
  BEDROCK: 'Bedrock',
};

const COLORS = {
  JAVA: '#f97316',   // orange
  BEDROCK: '#3b82f6', // blue
};

interface PlatformChartProps {
  data: PlatformData[];
}

export default function PlatformChart({ data }: PlatformChartProps) {
  const chartData = data.map(item => ({
    name: PLATFORM_LABELS[item.platform] || item.platform,
    value: item.count,
    platform: item.platform,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyek per Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.platform} fill={COLORS[entry.platform as GamePlatform] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} proyek`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}