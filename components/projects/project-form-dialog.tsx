"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
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
  DialogTrigger,
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
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  summary: z.string().min(1, "Ringkasan harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  type: z.nativeEnum(ProjectType),
  platform: z.nativeEnum(GamePlatform),
  status: z.nativeEnum(ProjectStatus),
  iconUrl: z.string().optional().or(z.literal("")),
  bannerUrl: z.string().optional().or(z.literal("")),
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

function isImageUrl(value: string) {
  return /^(https?:\/\/|\/)/.test(value.trim());
}

export default function ProjectFormDialog({
  mode,
  project,
  trigger,
  onSuccess,
}: ProjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const iconUrl = watch("iconUrl");
  const bannerUrl = watch("bannerUrl");

  // Fetch data saat mode edit dan dialog terbuka
  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      reset({
        name: "",
        summary: "",
        description: "",
        type: ProjectType.MOD,
        platform: GamePlatform.JAVA,
        status: ProjectStatus.DRAFT,
        iconUrl: "",
        bannerUrl: "",
      });
      return;
    }

    if (mode === "edit" && project?.id) {
      setIsFetching(true);
      fetch(`/api/projects/${project.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          // Debug: log data yang diterima
          console.log("Fetched project data:", data);
          
          // Reset form dengan data dari API
          reset({
            name: data.name || "",
            summary: data.summary || "",
            description: data.description || "",
            type: data.type || ProjectType.MOD,
            platform: data.platform || GamePlatform.JAVA,
            status: data.status || ProjectStatus.DRAFT,
            iconUrl: data.iconUrl || "",
            bannerUrl: data.bannerUrl || "",
          });
          
          toast.success("Data proyek berhasil dimuat");
        })
        .catch((error) => {
          console.error("Error fetching project:", error);
          toast.error(error.message || "Gagal memuat data proyek");
        })
        .finally(() => setIsFetching(false));
    }
  }, [open, mode, project, reset]);

  const handleUpload = async (file: File, field: "iconUrl" | "bannerUrl") => {
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

      setValue(field, data.url);
      toast.success("Gambar berhasil diunggah");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "iconUrl" | "bannerUrl"
  ) => {
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

    handleUpload(file, field);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // Debug: log values yang akan dikirim
      console.log("Submitting values:", values);
      
      const url = mode === "create" ? "/api/projects" : `/api/projects/${project?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan proyek");
      }

      toast.success(mode === "create" ? "Proyek berhasil dibuat" : "Proyek berhasil diperbarui");
      setOpen(false);
      reset();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(defaultValues);
      setIsFetching(false);
    }
  };

  const defaultTrigger =
    mode === "create" ? (
      <Button className="rounded-full bg-orange-600 text-white shadow-sm hover:bg-orange-500">
        <Plus className="mr-2 h-4 w-4" /> Tambah Proyek
      </Button>
    ) : undefined;

  const inputClass =
    "border-white/10 bg-black/60 text-white placeholder:text-white/30 focus-visible:ring-orange-500";
  const labelClass = "text-xs font-medium uppercase tracking-wide text-white/50";
  const errorClass = "mt-1 flex items-center gap-1 text-xs text-red-400";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
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

        {isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          </div>
        ) : (
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
                  disabled={isFetching}
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
                  disabled={isFetching}
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
                  disabled={isFetching}
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isFetching}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isFetching}
                      >
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isFetching}
                    >
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

              {/* Icon Upload */}
              <div className="flex items-start gap-3">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
                  ) : iconUrl && isImageUrl(iconUrl) ? (
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
                    <ImageIcon className="h-5 w-5 text-white/30" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "iconUrl")}
                      disabled={isUploading || isFetching}
                    />
                    <Input
                      {...register("iconUrl")}
                      placeholder="https://... atau upload gambar"
                      className={cn(inputClass, "flex-1")}
                      disabled={isFetching}
                    />
                    <button
                      type="button"
                      onClick={() => iconInputRef.current?.click()}
                      disabled={isUploading || isFetching}
                      className="rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 hover:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upload"}
                    </button>
                  </div>
                  {iconUrl && (
                    <button
                      type="button"
                      onClick={() => setValue("iconUrl", "")}
                      className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                      disabled={isFetching}
                    >
                      <XIcon className="h-3 w-3" /> Hapus icon
                    </button>
                  )}
                  {errors.iconUrl && (
                    <p className={errorClass}>
                      <AlertCircle className="h-3 w-3" /> {errors.iconUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Banner Upload */}
              <div className="space-y-1">
                <Label className={labelClass}>URL Banner</Label>
                <div className="flex items-center gap-2">
                  <Input
                    {...register("bannerUrl")}
                    placeholder="https://... atau upload gambar"
                    className={cn(inputClass, "flex-1")}
                    disabled={isFetching}
                  />
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "bannerUrl")}
                    disabled={isUploading || isFetching}
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={isUploading || isFetching}
                    className="rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 hover:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upload"}
                  </button>
                </div>
                {bannerUrl && (
                  <button
                    type="button"
                    onClick={() => setValue("bannerUrl", "")}
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
                    disabled={isFetching}
                  >
                    <XIcon className="h-3 w-3" /> Hapus banner
                  </button>
                )}
                {errors.bannerUrl && (
                  <p className={errorClass}>
                    <AlertCircle className="h-3 w-3" /> {errors.bannerUrl.message}
                  </p>
                )}
                {bannerUrl && isImageUrl(bannerUrl) && (
                  <div className="relative mt-1 h-24 w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bannerUrl}
                      alt="Banner preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading || isUploading || isFetching}
                className="rounded-full bg-orange-500 text-black hover:bg-orange-400"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Simpan" : "Update"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}