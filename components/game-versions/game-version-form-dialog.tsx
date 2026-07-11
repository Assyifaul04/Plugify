"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, PlusIcon } from "lucide-react";

const PLATFORMS = ["JAVA", "BEDROCK"] as const;

interface GameVersionFormDialogProps {
  mode: "create" | "edit";
  gameVersionId?: string;
  trigger?: React.ReactNode;
}

function toDateInputValue(date: string | Date | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function GameVersionFormDialog({
  mode,
  gameVersionId,
  trigger,
}: GameVersionFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [version, setVersion] = useState("");
  const [platform, setPlatform] = useState<string>("JAVA");
  const [isMajor, setIsMajor] = useState(true);
  const [isBeta, setIsBeta] = useState(false);
  const [releaseDate, setReleaseDate] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setVersion("");
      setPlatform("JAVA");
      setIsMajor(true);
      setIsBeta(false);
      setReleaseDate("");
      return;
    }

    if (mode === "edit" && gameVersionId) {
      setIsFetching(true);
      fetch(`/api/game-versions/${gameVersionId}`)
        .then((res) => res.json())
        .then((data) => {
          setVersion(data.version ?? "");
          setPlatform(data.platform ?? "JAVA");
          setIsMajor(data.isMajor ?? true);
          setIsBeta(data.isBeta ?? false);
          setReleaseDate(toDateInputValue(data.releaseDate));
        })
        .catch(() => toast.error("Gagal memuat data game version"))
        .finally(() => setIsFetching(false));
    }
  }, [open, mode, gameVersionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!version.trim()) {
      toast.error("Versi wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const url =
        mode === "create"
          ? "/api/game-versions"
          : `/api/game-versions/${gameVersionId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version,
          platform,
          isMajor,
          isBeta,
          releaseDate: releaseDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      toast.success(
        mode === "create"
          ? "Game version berhasil dibuat"
          : "Game version berhasil diperbarui"
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="bg-orange-600 text-white hover:bg-orange-500">
            <PlusIcon className="size-4" />
            Tambah Game Version
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Tambah Game Version" : "Edit Game Version"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Tambahkan versi game baru yang bisa digunakan project."
                : "Perbarui informasi game version."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="version">Versi</Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="cth. 1.20.1"
                disabled={isFetching}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Platform</Label>
              <Select
                value={platform}
                onValueChange={setPlatform}
                disabled={isFetching}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="releaseDate">Tanggal Rilis (opsional)</Label>
              <Input
                id="releaseDate"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                disabled={isFetching}
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={isMajor}
                  onCheckedChange={(checked) => setIsMajor(checked === true)}
                  disabled={isFetching}
                />
                Versi Major
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={isBeta}
                  onCheckedChange={(checked) => setIsBeta(checked === true)}
                  disabled={isFetching}
                />
                Versi Beta
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isFetching}
              className="bg-orange-600 text-white hover:bg-orange-500"
            >
              {isLoading && <Loader2Icon className="size-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}