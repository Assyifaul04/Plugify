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

export default function LoaderTable({ loaders }: LoaderTableProps) {
  if (loaders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">Belum ada loader.</p>
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
            <TableHead>Platform</TableHead>
            <TableHead>Tipe Didukung</TableHead>
            <TableHead className="text-center">Jumlah Version</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loaders.map((loader) => (
            <TableRow key={loader.id}>
              <TableCell>
                {loader.icon ? (
                  <span className="text-lg">{loader.icon}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
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
                      ? "border-orange-500/40 text-orange-500"
                      : "border-emerald-500/40 text-emerald-500"
                  }
                >
                  {loader.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {loader.supportedTypes.length > 0 ? (
                    loader.supportedTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{loader._count.versions}</Badge>
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