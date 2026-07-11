'use client';

import { Project, User } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface RecentProject extends Project {
  author: {
    name: string | null;
  };
}

interface RecentProjectsProps {
  projects: RecentProject[];
}

const statusColor: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  DRAFT: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  PENDING_REVIEW: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  ARCHIVED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  DELISTED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyek Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Proyek</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Belum ada proyek
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.author.name || 'Tanpa Nama'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[project.status] || ''}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(project.createdAt), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}