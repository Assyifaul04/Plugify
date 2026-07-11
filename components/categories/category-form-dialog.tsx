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
import { Loader2Icon, PlusIcon } from "lucide-react";

const PROJECT_TYPES = [
  "MOD",
  "MODPACK",
  "SHADER",
  "PLUGIN",
  "RESOURCE_PACK",
  "DATA_PACK",
  "MAP",
] as const;

interface CategoryFormDialogProps {
  mode: "create" | "edit";
  categoryId?: string;
  trigger?: React.ReactNode;
}

export default function CategoryFormDialog({
  mode,
  categoryId,
  trigger,
}: CategoryFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  // Ambil data lengkap saat mode edit & dialog dibuka
  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setName("");
      setIcon("");
      setProjectTypes([]);
      return;
    }

    if (mode === "edit" && categoryId) {
      setIsFetching(true);
      fetch(`/api/categories/${categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name ?? "");
          setIcon(data.icon ?? "");
          setProjectTypes(data.projectTypes ?? []);
        })
        .catch(() => toast.error("Gagal memuat data kategori"))
        .finally(() => setIsFetching(false));
    }
  }, [open, mode, categoryId]);

  function toggleProjectType(type: string) {
    setProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const url =
        mode === "create" ? "/api/categories" : `/api/categories/${categoryId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          icon: icon || null,
          projectTypes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      toast.success(
        mode === "create" ? "Kategori berhasil dibuat" : "Kategori berhasil diperbarui"
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
            Tambah Kategori
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Tambah Kategori" : "Edit Kategori"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? "Buat kategori baru untuk mengelompokkan project."
                : "Perbarui informasi kategori."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Teknologi"
                disabled={isFetching}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (opsional)</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="cth. nama ikon atau emoji"
                disabled={isFetching}
              />
            </div>

            <div className="grid gap-2">
              <Label>Tipe Project</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Checkbox
                      checked={projectTypes.includes(type)}
                      onCheckedChange={() => toggleProjectType(type)}
                      disabled={isFetching}
                    />
                    {type}
                  </label>
                ))}
              </div>
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