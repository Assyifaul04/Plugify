'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryData {
  name: string;
  count: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  // Ambil top 5 kategori dengan proyek terbanyak
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyek per Kategori (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sorted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => `${value} proyek`} />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Jumlah Proyek" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}