'use client';

import { License } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Link2, FileText } from 'lucide-react';
import Link from 'next/link';
import LicenseFormDialog from './license-form-dialog';

interface LicenseWithCount extends License {
  _count: {
    projects: number;
  };
}

interface LicenseTableProps {
  licenses: LicenseWithCount[];
}

export default function LicenseTable({ licenses }: LicenseTableProps) {
  if (licenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          📄
        </div>
        <p className="text-sm font-medium text-foreground">
          Belum ada lisensi
        </p>
        <p className="text-sm text-muted-foreground">
          Lisensi yang kamu buat akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-14"></TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nama
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              SPDX ID
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              URL
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jumlah Project
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.map((license) => (
            <TableRow
              key={license.id}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
            >
              <TableCell>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <FileText className="h-4 w-4" />
                </span>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {license.name}
              </TableCell>
              <TableCell>
                {license.spdxId ? (
                  <Badge
                    variant="outline"
                    className="rounded-full font-mono text-xs font-medium border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
                  >
                    {license.spdxId}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {license.url ? (
                  <Link
                    href={license.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-orange-600 transition-colors hover:text-orange-500 hover:underline dark:text-orange-400"
                  >
                    <Link2 className="h-3 w-3" />
                    <span className="max-w-[180px] truncate">{license.url}</span>
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-medium"
                >
                  {license._count.projects}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <LicenseFormDialog
                    mode="edit"
                    license={license}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}