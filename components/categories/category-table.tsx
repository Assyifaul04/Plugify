import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CategoryRowActions from "./category-row-actions";

export interface CategoryListItem {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count: {
    projects: number;
  };
}

interface CategoryTableProps {
  categories: CategoryListItem[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">Belum ada kategori.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-center">Jumlah Project</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.icon ? (
                  <span className="text-lg">{category.icon}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {category.name}
              </TableCell>
              <TableCell>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-muted-foreground hover:text-orange-500 hover:underline"
                >
                  {category.slug}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{category._count.projects}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <CategoryRowActions category={category} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}