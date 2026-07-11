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
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">Belum ada game version.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Versi</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Rilis</TableHead>
            <TableHead className="text-center">Dipakai Project</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameVersions.map((gv) => (
            <TableRow key={gv.id}>
              <TableCell className="font-medium text-foreground">
                {gv.version}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    gv.platform === "JAVA"
                      ? "border-orange-500/40 text-orange-500"
                      : "border-emerald-500/40 text-emerald-500"
                  }
                >
                  {gv.platform}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {gv.isMajor && (
                    <Badge variant="secondary" className="text-xs">
                      Major
                    </Badge>
                  )}
                  {gv.isBeta && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500/40 text-xs text-yellow-500"
                    >
                      Beta
                    </Badge>
                  )}
                  {!gv.isMajor && !gv.isBeta && (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(gv.releaseDate)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">{gv._count.versions}</Badge>
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