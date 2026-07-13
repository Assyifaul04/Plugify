import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import GameVersionRowActions from "./game-version-row-actions";

export interface GameVersionListItem {
  id: string;
  version: string;
  platform: "JAVA" | "BEDROCK";
  isMajor: boolean;
  isBeta: boolean;
  releaseDate: Date | string | null;
  _count: {
    versions: number;
  };
}

interface GameVersionTableProps {
  gameVersions: GameVersionListItem[];
}

function formatDate(date: Date | string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function GameVersionTable({ gameVersions }: GameVersionTableProps) {
  if (gameVersions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
          🎮
        </div>
        <p className="text-sm font-medium text-foreground">Belum ada game version</p>
        <p className="text-sm text-muted-foreground">
          Game version yang kamu buat akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Versi
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Platform
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tanggal Rilis
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Dipakai Project
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameVersions.map((gv) => (
            <TableRow
              key={gv.id}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/60"
            >
              <TableCell className="font-medium text-foreground">
                {gv.version}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    gv.platform === "JAVA"
                      ? "rounded-full border-orange-500/40 bg-orange-500/10 text-orange-500"
                      : "rounded-full border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                  }
                >
                  {gv.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {gv.isMajor && (
                    <Badge
                      variant="secondary"
                      className="rounded-full text-xs font-medium"
                    >
                      Major
                    </Badge>
                  )}
                  {gv.isBeta && (
                    <Badge
                      variant="outline"
                      className="rounded-full border-yellow-500/40 bg-yellow-500/10 text-xs font-medium text-yellow-500"
                    >
                      Beta
                    </Badge>
                  )}
                  {!gv.isMajor && !gv.isBeta && (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(gv.releaseDate)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-medium"
                >
                  {gv._count.versions}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <GameVersionRowActions gameVersion={gv} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}