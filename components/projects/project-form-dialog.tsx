// components/projects/project-form-dialog.tsx
"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project, ProjectType, GamePlatform, ProjectStatus } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  FolderPlus,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  summary: z.string().min(1, "Ringkasan harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  type: z.nativeEnum(ProjectType),
  platform: z.nativeEnum(GamePlatform),
  status: z.nativeEnum(ProjectStatus),
  iconUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormDialogProps {
  mode: "create" | "edit";
  project?: Project;
  trigger?: ReactNode;
  onSuccess?: () => void;
}

const typeLabels: Record<string, string> = {
  MOD: "Mod",
  MODPACK: "Modpack",
  SHADER: "Shader",
  PLUGIN: "Plugin",
  RESOURCE_PACK: "Resource Pack",
  DATA_PACK: "Data Pack",
  MAP: "Map",
};

const platformLabels: Record<string, string> = {
  JAVA: "Java",
  BEDROCK: "Bedrock",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const statusDot: Record<string, string> = {
  DRAFT: "bg-white/40",
  PUBLISHED: "bg-orange-500",
  ARCHIVED: "bg-white/20",
};

export default function ProjectFormDialog({
  mode,
  project,
  trigger,
  onSuccess,
}: ProjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const defaultValues: FormValues = {
    name: project?.name || "",
    summary: project?.summary || "",
    description: project?.description || "",
    type: project?.type || ProjectType.MOD,
    platform: project?.platform || GamePlatform.JAVA,
    status: project?.status || ProjectStatus.DRAFT,
    iconUrl: project?.iconUrl || "",
    bannerUrl: project?.bannerUrl || "",
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const iconUrl = watch("iconUrl");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const url = mode === "create" ? "/api/projects" : `/api/projects/${project?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Gagal menyimpan proyek");
      }

      toast.success(mode === "create" ? "Proyek berhasil dibuat" : "Proyek berhasil diperbarui");
      setOpen(false);
      reset();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger =
    mode === "create" ? (
      <Button className="bg-orange-500 text-black hover:bg-orange-400">
        <Plus className="mr-2 h-4 w-4" /> Tambah Proyek
      </Button>
    ) : undefined;

  const inputClass =
    "border-white/10 bg-black/60 text-white placeholder:text-white/30 focus-visible:ring-orange-500";
  const labelClass = "text-xs font-medium uppercase tracking-wide text-white/50";
  const errorClass = "mt-1 flex items-center gap-1 text-xs text-red-400";

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset(defaultValues);
      }}
    >
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        defaultTrigger && <span onClick={() => setOpen(true)}>{defaultTrigger}</span>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-black text-white sm:max-w-[640px]">
        <DialogHeader className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-orange-500/10 p-2 text-orange-400">
              <FolderPlus className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              {mode === "create" ? "Buat Proyek Baru" : "Edit Proyek"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-white/50">
            {mode === "create"
              ? "Lengkapi detail di bawah untuk mempublikasikan proyek baru."
              : "Perbarui informasi proyek kamu."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Informasi dasar */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Informasi Dasar
            </p>

            <div>
              <Label className={labelClass}>Nama Proyek</Label>
              <Input
                {...register("name")}
                placeholder="cth. Awesome Plugin"
                className={cn(inputClass, "mt-1.5")}
              />
              {errors.name && (
                <p className={errorClass}>
                  <AlertCircle className="h-3 w-3" /> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label className={labelClass}>Ringkasan</Label>
              <Input
                {...register("summary")}
                placeholder="Deskripsi singkat satu kalimat"
                className={cn(inputClass, "mt-1.5")}
              />
              {errors.summary && (
                <p className={errorClass}>
                  <AlertCircle className="h-3 w-3" /> {errors.summary.message}
                </p>
              )}
            </div>

            <div>
              <Label className={labelClass}>Deskripsi</Label>
              <Textarea
                {...register("description")}
                rows={4}
                placeholder="Jelaskan proyek kamu secara detail..."
                className={cn(inputClass, "mt-1.5 resize-none")}
              />
              {errors.description && (
                <p className={errorClass}>
                  <AlertCircle className="h-3 w-3" /> {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Klasifikasi */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Klasifikasi
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={labelClass}>Tipe</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={cn(inputClass, "mt-1.5")}>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-black text-white">
                        {Object.values(ProjectType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="focus:bg-orange-500/20 focus:text-orange-400"
                          >
                            {typeLabels[type] || type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className={errorClass}>
                    <AlertCircle className="h-3 w-3" /> {errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <Label className={labelClass}>Platform</Label>
                <Controller
                  control={control}
                  name="platform"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={cn(inputClass, "mt-1.5")}>
                        <SelectValue placeholder="Pilih platform" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-black text-white">
                        {Object.values(GamePlatform).map((platform) => (
                          <SelectItem
                            key={platform}
                            value={platform}
                            className="focus:bg-orange-500/20 focus:text-orange-400"
                          >
                            {platformLabels[platform] || platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.platform && (
                  <p className={errorClass}>
                    <AlertCircle className="h-3 w-3" /> {errors.platform.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label className={labelClass}>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn(inputClass, "mt-1.5")}>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-black text-white">
                      {Object.values(ProjectStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="focus:bg-orange-500/20 focus:text-orange-400"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                statusDot[status]
                              )}
                            />
                            {statusLabels[status] || status}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className={errorClass}>
                  <AlertCircle className="h-3 w-3" /> {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Media (Opsional)
            </p>

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconUrl}
                    alt="Icon preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="h-4 w-4 text-white/30" />
                )}
              </div>
              <div className="flex-1">
                <Label className={labelClass}>URL Icon</Label>
                <Input
                  {...register("iconUrl")}
                  placeholder="https://..."
                  className={cn(inputClass, "mt-1.5")}
                />
                {errors.iconUrl && (
                  <p className={errorClass}>
                    <AlertCircle className="h-3 w-3" /> {errors.iconUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label className={labelClass}>URL Banner</Label>
              <Input
                {...register("bannerUrl")}
                placeholder="https://..."
                className={cn(inputClass, "mt-1.5")}
              />
              {errors.bannerUrl && (
                <p className={errorClass}>
                  <AlertCircle className="h-3 w-3" /> {errors.bannerUrl.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-black hover:bg-orange-400"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Simpan" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}