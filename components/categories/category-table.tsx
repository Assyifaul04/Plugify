import Link from "next/link";
import Image from "next/image";
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

// Fungsi pembantu untuk mendeteksi URL gambar
function isImageUrl(value: string) {
  return /^(https?:\/\/|\/)/.test(value.trim());
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          🗂️
        </div>
        <p className="text-sm font-medium text-foreground">
          Belum ada kategori
        </p>
        <p className="text-sm text-muted-foreground">
          Kategori yang kamu buat akan muncul di sini.
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
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
            >
              <TableCell>
                {category.icon ? (
                  isImageUrl(category.icon) ? (
                    // Tampilkan gambar jika URL
                    <div className="relative h-9 w-9 overflow-hidden rounded-full">
                      <Image
                        src={category.icon}
                        alt={category.name}
                        fill
                        className="object-cover"
                        unoptimized // jika menggunakan gambar lokal di public, bisa dihilangkan
                      />
                    </div>
                  ) : (
                    // Tampilkan emoji / teks biasa
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-lg">
                      {category.icon}
                    </span>
                  )
                ) : (
                  // Placeholder jika tidak ada icon
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    —
                  </span>
                )}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {category.name}
              </TableCell>
              <TableCell>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-muted-foreground underline-offset-4 transition-colors hover:text-orange-500 hover:underline"
                >
                  {category.slug}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-medium"
                >
                  {category._count.projects}
                </Badge>
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