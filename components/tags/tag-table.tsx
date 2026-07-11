'use client';

import { Tag } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-center">Projects</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                Tidak ada tag ditemukan
              </TableCell>
            </TableRow>
          ) : (
            tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>{tag.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {tag.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm font-medium">{tag._count.projects}</span>
                    <span className="text-xs text-muted-foreground">projects</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TagFormDialog 
                      mode="edit" 
                      tag={tag}
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
