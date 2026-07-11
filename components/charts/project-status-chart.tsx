'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectStatus } from '@prisma/client';

interface StatusData {
  status: ProjectStatus;
  count: number;
}

const COLORS = {
  PUBLISHED: '#22c55e',   // green
  DRAFT: '#94a3b8',       // slate
  PENDING_REVIEW: '#f59e0b', // amber
  ARCHIVED: '#6366f1',    // indigo
  REJECTED: '#ef4444',    // red
  DELISTED: '#8b5cf6',    // purple
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  PUBLISHED: 'Dipublikasikan',
  DRAFT: 'Draf',
  PENDING_REVIEW: 'Menunggu Review',
  ARCHIVED: 'Diarsipkan',
  REJECTED: 'Ditolak',
  DELISTED: 'Dihapus',
};

interface ProjectStatusChartProps {
  data: StatusData[];
}

export default function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Proyek</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={COLORS[entry.status as ProjectStatus] || '#94a3b8'} />
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