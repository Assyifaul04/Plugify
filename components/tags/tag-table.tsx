'use client';

import { Tag } from '@prisma/client';
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
import { Edit, Trash2, Hash } from 'lucide-react';
import TagFormDialog from './tag-form-dialog';

interface TagWithCount extends Tag {
  _count: {
    projects: number;
  };
}

interface TagTableProps {
  tags: TagWithCount[];
}

export default function TagTable({ tags }: TagTableProps) {
  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          🏷️
        </div>
        <p className="text-sm font-medium text-foreground">Belum ada tag</p>
        <p className="text-sm text-muted-foreground">
          Tag yang kamu buat akan muncul di sini.
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
              Slug
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
          {tags.map((tag) => (
            <TableRow
              key={tag.id}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
            >
              <TableCell>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Hash className="h-4 w-4" />
                </span>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {tag.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="rounded-full font-mono text-xs font-medium"
                >
                  {tag.slug}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-medium"
                >
                  {tag._count.projects}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <TagFormDialog
                    mode="edit"
                    tag={tag}
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