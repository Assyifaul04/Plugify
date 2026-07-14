"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
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
  ExternalLink,
  Clock,
  Layers,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteProjectDialog from "@/components/projects/delete-project-dialog";
import dynamic from "next/dynamic";

// Dynamic import untuk ProjectFormDialog
const ProjectFormDialog = dynamic(
  () => import("@/components/projects/project-form-dialog"),
  {
    ssr: false,
    loading: () => (
      <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600" disabled>
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Edit
      </Button>
    ),
  }
);

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

interface ProjectDetailPageClientProps {
  project: any;
}

export default function ProjectDetailPageClient({ project }: ProjectDetailPageClientProps) {
  const router = useRouter();

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
            <span className="text-sm text-white/50 truncate max-w-[200px]">{project.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <ProjectFormDialog
              mode="edit"
              project={project}
              trigger={
                <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
              }
              onSuccess={() => router.refresh()}
            />
            <DeleteProjectDialog
              projectId={project.id}
              projectName={project.name}
              trigger={
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Hapus
                </Button>
              }
              onSuccess={() => router.push("/dashboard/projects")}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10">
          <div className="relative h-48 w-full sm:h-64">
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
            <div className="-mt-12 flex items-end gap-5 sm:-mt-16">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black shadow-xl sm:h-28 sm:w-28">
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
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {project.name}
                  </h1>
                  <Badge
                    className={cn(
                      "border px-2.5 py-0.5 text-[11px] font-medium",
                      statusColors[project.status] || "bg-white/10"
                    )}
                  >
                    {statusLabels[project.status] || project.status}
                  </Badge>
                </div>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                  {project.summary}
                </p>
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

            <div className="flex items-center gap-2">
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

        {/* Stats Strip */}
        <div className="mb-8 grid grid-cols-2 divide-x divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-4 sm:divide-y-0">
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

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Info */}
          <aside className="order-2 lg:order-1 lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
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

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                <User className="h-3 w-3" /> Author
              </h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  <Building2 className="h-3 w-3" /> Organisasi
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/40">
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
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

          {/* Main Content - Tabs */}
          <div className="order-1 lg:order-2 lg:col-span-3">
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
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                  {project.description ? (
                    <div 
                      className="prose prose-invert max-w-none text-white/80
                        prose-headings:text-white prose-headings:font-bold
                        prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
                        prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
                        prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
                        prose-h4:text-lg prose-h4:mt-3 prose-h4:mb-1
                        prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-3
                        prose-a:text-orange-400 prose-a:underline prose-a:underline-offset-2 prose-a:hover:text-orange-300
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-3
                        prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-3
                        prose-li:text-white/80 prose-li:mb-1
                        prose-blockquote:border-l-orange-500 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:my-3 prose-blockquote:bg-white/5 prose-blockquote:rounded-r prose-blockquote:text-white/70
                        prose-code:text-orange-300 prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-3
                        prose-img:rounded-lg prose-img:my-4 prose-img:border prose-img:border-white/10
                        prose-table:border-collapse prose-table:w-full prose-table:my-3
                        prose-th:border prose-th:border-white/10 prose-th:bg-white/5 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-white
                        prose-td:border prose-td:border-white/10 prose-td:px-3 prose-td:py-2 prose-td:text-white/80
                        prose-hr:border-white/10 prose-hr:my-6"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  ) : (
                    <p className="text-sm text-white/40">Belum ada deskripsi.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="versions" className="mt-0">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                  {project.versions.length === 0 ? (
                    <p className="text-sm text-white/40">Belum ada versi yang dirilis.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {project.versions.map((version: any, index: number) => {
                        if (!version?.id) return null;
                        return (
                          <div
                            key={version.id || index}
                            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
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
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
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
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// Link Row Component
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