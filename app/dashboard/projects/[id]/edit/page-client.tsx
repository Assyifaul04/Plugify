"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProjectType, GamePlatform, ProjectStatus } from "@prisma/client";
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
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  XIcon,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

interface ProjectFormPageProps {
  mode: "create" | "edit";
  project?: any;
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

/** A settings-style section row: label/description on the left, control(s) on the right. */
function FormSection({
  title,
  description,
  children,
  first,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 py-8 md:grid-cols-12",
        !first && "border-t border-white/10"
      )}
    >
      <div className="md:col-span-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-white/40">{description}</p>}
      </div>
      <div className="space-y-5 md:col-span-8">{children}</div>
    </div>
  );
}

export default function ProjectFormPage({ mode, project }: ProjectFormPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
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
  const nameValue = watch("name");
  const statusValue = watch("status");

  useEffect(() => {
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
  }, [mode, project, reset]);

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
      const url = mode === "create" ? "/api/projects" : `/api/projects/${project?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan proyek");
      }

      toast.success(mode === "create" ? "Proyek berhasil dibuat" : "Proyek berhasil diperbarui");
      router.push("/dashboard/projects");
      router.refresh();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border-white/10 bg-white/[0.03] text-white placeholder:text-white/30 focus-visible:ring-orange-500 focus-visible:ring-offset-0";
  const labelClass = "text-xs font-medium uppercase tracking-wide text-white/50";
  const errorClass = "mt-1.5 flex items-center gap-1 text-xs text-red-400";

  if (isFetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-3 sm:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/projects")}
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Kembali
            </Button>
            <span className="text-sm text-white/30">/</span>
            <span className="text-sm text-white/50">
              {mode === "create" ? "Buat Proyek Baru" : `Edit: ${project?.name}`}
            </span>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/projects")}
              disabled={loading}
              className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Batal
            </Button>
            <Button
              size="sm"
              disabled={loading || isUploading}
              onClick={handleSubmit(onSubmit)}
              className="rounded-full bg-orange-500 text-black hover:bg-orange-400"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {mode === "create" ? "Simpan" : "Update"}
            </Button>
          </div>
        </div>
      </div>

      {/* Page header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-orange-500/[0.06] to-transparent">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            {mode === "create" ? "Proyek Baru" : "Pengaturan Proyek"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            {nameValue?.trim() ? nameValue : mode === "create" ? "Buat Proyek Baru" : "Edit Proyek"}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-white/50">
              <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[statusValue])} />
              {statusLabels[statusValue] || statusValue}
            </span>
            <span className="text-sm text-white/50">
              {mode === "create"
                ? "Lengkapi detail di bawah untuk mempublikasikan proyek baru."
                : "Perbarui informasi proyek kamu."}
            </span>
          </div>
        </div>
      </div>

      {/* Form Content — full width, no boxed card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <FormSection
            first
            title="Informasi Dasar"
            description="Nama, ringkasan, dan deskripsi lengkap proyek kamu."
          >
            <div>
              <Label className={labelClass}>Nama Proyek</Label>
              <Input
                {...register("name")}
                placeholder="cth. Awesome Plugin"
                className={cn(inputClass, "mt-1.5 h-11")}
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
                className={cn(inputClass, "mt-1.5 h-11")}
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
                rows={7}
                placeholder="Jelaskan proyek kamu secara detail..."
                className={cn(inputClass, "mt-1.5 resize-none")}
              />
              {errors.description && (
                <p className={errorClass}>
                  <AlertCircle className="h-3 w-3" /> {errors.description.message}
                </p>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Klasifikasi"
            description="Tentukan jenis, platform, dan status publikasi proyek."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className={labelClass}>Tipe</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(inputClass, "mt-1.5 h-11")}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(inputClass, "mt-1.5 h-11")}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(inputClass, "mt-1.5 h-11 sm:w-1/2")}>
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
                            <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[status])} />
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
          </FormSection>

          <FormSection
            title="Media"
            description="Icon dan banner bersifat opsional, tapi membuat proyek lebih menarik."
          >
            {/* Icon Upload */}
            <div>
              <Label className={labelClass}>Icon Proyek</Label>
              <div className="mt-1.5 flex items-start gap-3">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
                  ) : iconUrl && isImageUrl(iconUrl) ? (
                    <Image
                      src={iconUrl}
                      alt="Icon preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-white/30" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "iconUrl")}
                      disabled={isUploading}
                    />
                    <Input
                      {...register("iconUrl")}
                      placeholder="https://... atau upload gambar"
                      className={cn(inputClass, "h-11 flex-1")}
                    />
                    <button
                      type="button"
                      onClick={() => iconInputRef.current?.click()}
                      disabled={isUploading}
                      className="h-11 shrink-0 rounded-md bg-orange-500/10 px-4 text-xs font-medium text-orange-400 hover:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upload"}
                    </button>
                  </div>
                  {iconUrl && (
                    <button
                      type="button"
                      onClick={() => setValue("iconUrl", "")}
                      className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
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
            </div>

            {/* Banner Upload */}
            <div>
              <Label className={labelClass}>URL Banner</Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  {...register("bannerUrl")}
                  placeholder="https://... atau upload gambar"
                  className={cn(inputClass, "h-11 flex-1")}
                />
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "bannerUrl")}
                  disabled={isUploading}
                />
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={isUploading}
                  className="h-11 shrink-0 rounded-md bg-orange-500/10 px-4 text-xs font-medium text-orange-400 hover:bg-orange-500/20 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Upload"}
                </button>
              </div>
              {bannerUrl && (
                <button
                  type="button"
                  onClick={() => setValue("bannerUrl", "")}
                  className="mt-1.5 flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
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
                <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                  <Image
                    src={bannerUrl}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </FormSection>

          {/* Actions (mobile / bottom fallback) */}
          <div className="flex justify-end gap-3 border-t border-white/10 py-8 sm:hidden">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/projects")}
              disabled={loading}
              className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || isUploading}
              className="rounded-full bg-orange-500 text-black hover:bg-orange-400"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {mode === "create" ? "Simpan" : "Update"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}