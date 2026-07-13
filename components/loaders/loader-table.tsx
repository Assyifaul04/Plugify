import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LoaderRowActions from "./loader-row-actions";

export interface LoaderListItem {
  id: string;
  name: string;
  icon: string | null;
  platform: "JAVA" | "BEDROCK";
  supportedTypes: string[];
  _count: {
    versions: number;
  };
}

interface LoaderTableProps {
  loaders: LoaderListItem[];
}

// Fungsi pembantu untuk mendeteksi URL gambar
function isImageUrl(value: string) {
  return /^(https?:\/\/|\/)/.test(value.trim());
}

export default function LoaderTable({ loaders }: LoaderTableProps) {
  if (loaders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          ⚙️
        </div>
        <p className="text-sm font-medium text-foreground">Belum ada loader</p>
        <p className="text-sm text-muted-foreground">
          Loader yang kamu buat akan muncul di sini.
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
              Platform
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tipe Didukung
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jumlah Versi
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loaders.map((loader) => (
            <TableRow
              key={loader.id}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
            >
              <TableCell>
                {loader.icon ? (
                  isImageUrl(loader.icon) ? (
                    // Tampilkan gambar jika URL
                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={loader.icon}
                        alt={loader.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    // Tampilkan emoji / teks biasa
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-lg">
                      {loader.icon}
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
                {loader.name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    loader.platform === "JAVA"
                      ? "rounded-full border-orange-500/40 bg-orange-500/10 text-orange-500"
                      : "rounded-full border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                  }
                >
                  {loader.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {loader.supportedTypes.length > 0 ? (
                    loader.supportedTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="rounded-full text-xs font-medium"
                      >
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-medium"
                >
                  {loader._count.versions}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <LoaderRowActions loader={loader} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}