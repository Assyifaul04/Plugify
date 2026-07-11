'use client';

import { License } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>SPDX ID</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-center">Projects</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Tidak ada lisensi ditemukan
              </TableCell>
            </TableRow>
          ) : (
            licenses.map((license) => (
              <TableRow key={license.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{license.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {license.spdxId ? (
                    <Badge variant="outline" className="font-mono text-xs bg-blue-50 dark:bg-blue-950/30">
                      {license.spdxId}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {license.url ? (
                    <Link 
                      href={license.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <Link2 className="h-3 w-3" />
                      <span className="truncate max-w-[200px]">{license.url}</span>
                    </Link>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm font-medium">{license._count.projects}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <LicenseFormDialog 
                      mode="edit" 
                      license={license}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}