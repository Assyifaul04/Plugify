"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2Icon,
  PlusIcon,
  ImageUpIcon,
  XIcon,
} from "lucide-react";

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

function isImageUrl(value: string) {
  return /^(https?:\/\/|\/)/.test(value.trim());
}

export default function CategoryFormDialog({
  mode,
  categoryId,
  trigger,
}: CategoryFormDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah gambar");
      }

      setIcon(data.url);
      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah gambar"
      );
    } finally {
      setIsUploading(false);
    }
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

  const disabled = isFetching || isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500">
            <PlusIcon className="size-4" />
            Tambah Kategori
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
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

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Teknologi"
                disabled={isFetching}
                required
                className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>

            <div className="grid gap-2">
              <Label>Icon (opsional)</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={disabled}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="group relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 transition-colors hover:border-orange-600/50 hover:bg-orange-600/5 disabled:pointer-events-none disabled:opacity-60"
                >
                  {isUploading ? (
                    <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
                  ) : icon && isImageUrl(icon) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={icon}
                      alt="Icon kategori"
                      className="size-full object-cover"
                    />
                  ) : icon ? (
                    <span className="text-xl">{icon}</span>
                  ) : (
                    <ImageUpIcon className="size-5 text-muted-foreground transition-colors group-hover:text-orange-600" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5">
                  <Input
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Emoji, atau upload gambar →"
                    disabled={disabled}
                    className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={disabled}
                      className="font-medium text-orange-600 hover:underline disabled:pointer-events-none disabled:opacity-60"
                    >
                      Unggah gambar
                    </button>
                    {icon && (
                      <button
                        type="button"
                        onClick={() => setIcon("")}
                        disabled={disabled}
                        className="flex items-center gap-0.5 hover:text-foreground disabled:pointer-events-none"
                      >
                        <XIcon className="size-3" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tipe Project</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map((type) => {
                  const checked = projectTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        checked
                          ? "border-orange-600/40 bg-orange-600/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent/60"
                      } ${isFetching ? "pointer-events-none opacity-60" : ""}`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleProjectType(type)}
                        disabled={isFetching}
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="rounded-full"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isFetching || isUploading}
              className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500"
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