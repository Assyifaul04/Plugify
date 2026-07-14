"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Calendar,
  User,
  Building2,
  Tag,
  Code2,
  Bug,
  BookOpen,
  MessageCircle,
  Heart,
  Star,
  FileText,
  Loader2,
  ExternalLink,
  Clock,
  AlertCircle,
  Layers,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DetailProjectDialogProps {
  projectId: string;
  trigger: React.ReactNode;
  onClose?: () => void;
}

interface ProjectDetail {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  type: string;
  platform: string;
  status: string;
  iconUrl: string | null;
  bannerUrl: string | null;
  sourceUrl: string | null;
  issuesUrl: string | null;
  wikiUrl: string | null;
  discordUrl: string | null;
  donationUrl: string | null;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  author: {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string | null;
    role: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  } | null;
  license: {
    id: string;
    name: string;
    spdxId: string;
    url: string;
  } | null;
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
      icon: string | null;
    };
  }[];
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  versions: {
    id: string;
    versionNumber: string;
    name: string;
    channel: string;
    createdAt: string;
    downloadCount: number;
    _count: {
      files: number;
    };
  }[];
  gallery: {
    id: string;
    url: string;
    caption: string | null;
    isCover: boolean;
  }[];
  _count: {
    versions: number;
    follows: number;
    reviews: number;
    reports: number;
  };
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

const statusColors: Record<string, string> = {
  DRAFT: "bg-white/10 text-white/60 border-white/10",
  PUBLISHED: "bg-green-500/15 text-green-400 border-green-500/25",
  ARCHIVED: "bg-white/5 text-white/40 border-white/10",
};

const channelColors: Record<string, string> = {
  RELEASE: "bg-green-500/15 text-green-400 border-green-500/25",
  BETA: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  ALPHA: "bg-red-500/15 text-red-400 border-red-500/25",
};

export default function DetailProjectDialog({
  projectId,
  trigger,
  onClose,
}: DetailProjectDialogProps) {
  if (!projectId) {
    console.warn("DetailProjectDialog: projectId is required");
    return null;
  }

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Proyek tidak ditemukan");
        } else if (response.status === 401) {
          throw new Error("Anda tidak memiliki akses");
        } else {
          throw new Error(`Gagal memuat detail proyek (${response.status})`);
        }
      }

      const data = await response.json();
      setProject(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat detail proyek";
      setError(errorMessage);
      console.error("Error fetching project detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && projectId) {
      fetchProjectDetail();
    }
  }, [open, projectId]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setProject(null);
      setError(null);
      if (onClose) onClose();
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return "-";
    if (typeof date === "object" && Object.keys(date).length === 0) return "-";
    if (typeof date === "string") {
      try {
        return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: id });
      } catch {
        return date;
      }
    }
    return "-";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const safeProject = project
    ? {
        id: project.id || "",
        name: project.name || "Unnamed",
        slug: project.slug || "",
        summary: project.summary || "",
        description: project.description || "",
        type: project.type || "UNKNOWN",
        platform: project.platform || "UNKNOWN",
        status: project.status || "DRAFT",
        iconUrl: project.iconUrl || null,
        bannerUrl: project.bannerUrl || null,
        sourceUrl: project.sourceUrl || null,
        issuesUrl: project.issuesUrl || null,
        wikiUrl: project.wikiUrl || null,
        discordUrl: project.discordUrl || null,
        donationUrl: project.donationUrl || null,
        downloadCount:
          typeof project.downloadCount === "number" ? project.downloadCount : 0,
        createdAt:
          typeof project.createdAt === "string" && project.createdAt
            ? project.createdAt
            : new Date().toISOString(),
        updatedAt:
          typeof project.updatedAt === "string" && project.updatedAt
            ? project.updatedAt
            : new Date().toISOString(),
        publishedAt:
          typeof project.publishedAt === "string" && project.publishedAt
            ? project.publishedAt
            : null,
        author: {
          id: project.author?.id || "",
          name: project.author?.name || project.author?.username || "Unknown",
          username: project.author?.username || "",
          email: project.author?.email || "",
          image: project.author?.image || null,
          role: project.author?.role || "USER",
        },
        organization: project.organization
          ? {
              id: project.organization.id || "",
              name: project.organization.name || "Unknown",
              slug: project.organization.slug || "",
              icon: project.organization.icon || null,
            }
          : null,
        license: project.license
          ? {
              id: project.license.id || "",
              name: project.license.name || "Unknown",
              spdxId: project.license.spdxId || "",
              url: project.license.url || "",
            }
          : null,
        categories: Array.isArray(project.categories) ? project.categories : [],
        tags: Array.isArray(project.tags) ? project.tags : [],
        versions: Array.isArray(project.versions) ? project.versions : [],
        gallery: Array.isArray(project.gallery) ? project.gallery : [],
        _count: {
          versions: project._count?.versions || 0,
          follows: project._count?.follows || 0,
          reviews: project._count?.reviews || 0,
          reports: project._count?.reports || 0,
        },
      }
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-6xl overflow-hidden border-white/10 bg-black p-0 text-white">
        {loading ? (
          <div className="flex min-h-[480px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
              <p className="text-sm text-white/40">Memuat detail proyek…</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[480px] flex-col items-center justify-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <p className="text-center text-red-400">{error}</p>
            <Button
              variant="outline"
              onClick={fetchProjectDetail}
              className="border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              Coba Lagi
            </Button>
          </div>
        ) : safeProject ? (
          <RenderProjectContent
            project={safeProject}
            formatDate={formatDate}
            formatNumber={formatNumber}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function RenderProjectContent({
  project,
  formatDate,
  formatNumber,
}: {
  project: any;
  formatDate: (date: any) => string;
  formatNumber: (num: number) => string;
}) {
  return (
    <div className="flex max-h-[90vh] flex-col">
      {/* ===== TOP BAR: Banner strip + identity ===== */}
      <div className="relative border-b border-white/10">
        <div className="relative h-40 w-full overflow-hidden sm:h-48">
          {project.bannerUrl ? (
            <Image
              src={project.bannerUrl}
              alt={project.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-orange-500/10 via-white/5 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-6 pt-0 sm:px-10">
          <div className="-mt-12 flex items-end gap-5 sm:-mt-14">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black shadow-xl sm:h-24 sm:w-24">
              {project.iconUrl ? (
                <Image
                  src={project.iconUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/60">
                  {project.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="pb-1">
              <DialogHeader className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <DialogTitle className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {project.name}
                  </DialogTitle>
                  <Badge
                    className={cn(
                      "border px-2.5 py-0.5 text-[11px] font-medium",
                      statusColors[project.status] || "bg-white/10"
                    )}
                  >
                    {statusLabels[project.status] || project.status}
                  </Badge>
                </div>
                <DialogDescription className="max-w-xl text-sm leading-relaxed text-white/55">
                  {project.summary}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/40">
                <Badge variant="outline" className="border-white/10 bg-white/5 px-2.5 py-0.5 text-white/60">
                  {typeLabels[project.type] || project.type}
                </Badge>
                <span className="text-white/20">•</span>
                <span>{platformLabels[project.platform] || project.platform}</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-white/35">{project.slug}</span>
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
            {project.sourceUrl && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Code2 className="mr-1.5 h-3.5 w-3.5" />
                  Source
                </a>
              </Button>
            )}
            <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* ===== METRICS STRIP ===== */}
      <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-b border-white/10 bg-white/[0.02] sm:grid-cols-4 sm:divide-y-0">
        {[
          { icon: Download, value: formatNumber(project.downloadCount), label: "Downloads", color: "text-blue-400" },
          { icon: Heart, value: formatNumber(project._count.follows), label: "Followers", color: "text-red-400" },
          { icon: Star, value: formatNumber(project._count.reviews), label: "Reviews", color: "text-yellow-400" },
          { icon: Layers, value: project._count.versions, label: "Versions", color: "text-green-400" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="flex items-center gap-3 px-6 py-4 sm:px-8">
            <Icon className={cn("h-5 w-5", color)} />
            <div className="leading-tight">
              <p className="text-base font-semibold text-white">{value}</p>
              <p className="text-[11px] text-white/40">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MAIN: sidebar + content ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar info */}
        <aside className="hidden w-72 shrink-0 space-y-7 overflow-y-auto border-r border-white/10 p-7 lg:block">
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              <Info className="h-3 w-3" /> Detail
            </h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-xs text-white/40">Dibuat</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-white/80">
                  <Calendar className="h-3.5 w-3.5 text-white/30" />
                  {formatDate(project.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-white/40">Dipublikasi</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-white/80">
                  <Clock className="h-3.5 w-3.5 text-white/30" />
                  {formatDate(project.publishedAt)}
                </dd>
              </div>
              {project.license && (
                <div>
                  <dt className="text-xs text-white/40">Lisensi</dt>
                  <dd className="mt-1">
                    <a
                      href={project.license.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-orange-400 hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {project.license.name}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              <User className="h-3 w-3" /> Author
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={project.author?.image || undefined} />
                <AvatarFallback className="bg-orange-500/20 text-xs text-orange-400">
                  {project.author?.name?.charAt(0) ||
                    project.author?.username?.charAt(0) ||
                    "?"}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-sm text-white/90">
                  {project.author?.name || project.author?.username || "Unknown"}
                </p>
                <p className="text-xs text-white/40">@{project.author?.username || "-"}</p>
              </div>
            </div>
          </div>

          {project.organization && (
            <div>
              <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                <Building2 className="h-3 w-3" /> Organisasi
              </h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={project.organization.icon || undefined} />
                  <AvatarFallback className="bg-purple-500/20 text-xs text-purple-400">
                    {project.organization.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-white/90">{project.organization.name}</span>
              </div>
            </div>
          )}

          {(project.categories.length > 0 || project.tags.length > 0) && (
            <div>
              <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                <Tag className="h-3 w-3" /> Kategori & Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.categories.map((item: any, index: number) => {
                  const category = item?.category || item;
                  if (!category?.id) return null;
                  return (
                    <Badge
                      key={category.id || index}
                      variant="outline"
                      className="border-white/10 bg-white/5 text-[11px] text-white/70"
                    >
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name || "Unknown"}
                    </Badge>
                  );
                })}
                {project.tags.map((item: any, index: number) => {
                  const tag = item?.tag || item;
                  if (!tag?.id) return null;
                  return (
                    <Badge
                      key={tag.id || index}
                      variant="outline"
                      className="border-white/10 bg-white/5 text-[11px] text-white/50"
                    >
                      #{tag.name || "Unknown"}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {(project.sourceUrl ||
            project.issuesUrl ||
            project.wikiUrl ||
            project.discordUrl ||
            project.donationUrl) && (
            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Links
              </h3>
              <div className="space-y-1">
                {project.sourceUrl && (
                  <LinkRow href={project.sourceUrl} icon={Code2} label="Source Code" />
                )}
                {project.issuesUrl && (
                  <LinkRow href={project.issuesUrl} icon={Bug} label="Issues" />
                )}
                {project.wikiUrl && (
                  <LinkRow href={project.wikiUrl} icon={BookOpen} label="Wiki" />
                )}
                {project.discordUrl && (
                  <LinkRow href={project.discordUrl} icon={MessageCircle} label="Discord" />
                )}
                {project.donationUrl && (
                  <LinkRow href={project.donationUrl} icon={Heart} label="Donate" />
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Content with tabs */}
        <div className="flex-1 overflow-y-auto p-7 sm:p-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 h-10 border border-white/10 bg-white/[0.03] p-1">
              <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-white/10">
                Overview
              </TabsTrigger>
              <TabsTrigger value="versions" className="text-xs data-[state=active]:bg-white/10">
                Versions ({project.versions.length})
              </TabsTrigger>
              <TabsTrigger value="gallery" className="text-xs data-[state=active]:bg-white/10">
                Gallery ({project.gallery.length})
              </TabsTrigger>
              {/* Sidebar duplicate on small screens */}
              <TabsTrigger value="info" className="text-xs data-[state=active]:bg-white/10 lg:hidden">
                Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-4">
              {project.description ? (
                <div
                  className="prose prose-invert max-w-none text-sm leading-relaxed text-white/80 [&>p]:mb-3"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              ) : (
                <p className="text-sm text-white/40">Belum ada deskripsi.</p>
              )}
            </TabsContent>

            <TabsContent value="versions" className="mt-0 space-y-2.5">
              {project.versions.length === 0 ? (
                <p className="text-sm text-white/40">Belum ada versi yang dirilis.</p>
              ) : (
                project.versions.map((version: any, index: number) => {
                  if (!version?.id) return null;
                  return (
                    <div
                      key={version.id || index}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3.5">
                        <Badge
                          variant="outline"
                          className={cn("border text-[10px]", channelColors[version.channel] || "border-white/10 bg-white/10 text-white")}
                        >
                          {version.channel || "UNKNOWN"}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium text-white/90">
                            {version.name || version.versionNumber || "Unknown"}
                          </p>
                          <p className="text-xs text-white/40">{formatDate(version.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1.5">
                          <Download className="h-3.5 w-3.5" />
                          {formatNumber(version.downloadCount || 0)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          {version._count?.files || 0}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              {project.gallery.length === 0 ? (
                <p className="text-sm text-white/40">Belum ada gambar galeri.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {project.gallery.map((image: any, index: number) => {
                    if (!image?.id || !image?.url) return null;
                    return (
                      <div
                        key={image.id || index}
                        className="group relative aspect-video overflow-hidden rounded-xl border border-white/10"
                      >
                        <Image
                          src={image.url}
                          alt={image.caption || "Gallery image"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {image.isCover && (
                          <Badge className="absolute right-2 top-2 border-0 bg-orange-500/80 text-[10px]">
                            Cover
                          </Badge>
                        )}
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2.5 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Mobile-only info tab mirrors sidebar content */}
            <TabsContent value="info" className="mt-0 space-y-5 lg:hidden">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={project.author?.image || undefined} />
                  <AvatarFallback className="bg-orange-500/20 text-xs text-orange-400">
                    {project.author?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-white/90">
                  {project.author?.name || project.author?.username}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.categories.map((item: any, index: number) => {
                  const category = item?.category || item;
                  if (!category?.id) return null;
                  return (
                    <Badge key={category.id || index} variant="outline" className="border-white/10 bg-white/5 text-[11px] text-white/70">
                      {category.name}
                    </Badge>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* ===== MOBILE ACTIONS BAR ===== */}
      <div className="flex shrink-0 items-center gap-2.5 border-t border-white/10 bg-black p-4 sm:hidden">
        {project.sourceUrl && (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Code2 className="mr-1.5 h-3.5 w-3.5" />
              Source
            </a>
          </Button>
        )}
        <Button size="sm" className="flex-1 bg-orange-500 text-white hover:bg-orange-600">
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download
        </Button>
      </div>
    </div>
  );
}

function LinkRow({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="flex-1">{label}</span>
      <ExternalLink className="h-3 w-3 text-white/30" />
    </a>
  );
}