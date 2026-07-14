"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Download,
  Heart,
  Star,
  Share2,
  Code2,
  Bug,
  BookOpen,
  MessageCircle,
  ExternalLink,
  FileText,
  Blocks,
  Layers,
  Package,
  Clock,
  Bookmark,
  MoreHorizontal,
  Sun,
  Moon,
  Coffee,
  Monitor,
  Users,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ProjectDetailClientProps {
  project: any;
}

const platformLabels: Record<string, string> = {
  JAVA: "Java Edition",
  BEDROCK: "Bedrock",
};

const statusStyles: Record<string, string> = {
  DRAFT: "border border-border text-muted-foreground bg-transparent",
  PUBLISHED: "border border-orange-500/30 bg-orange-500/15 text-orange-500",
  ARCHIVED: "border border-border text-muted-foreground/60 bg-transparent line-through",
  PENDING_REVIEW: "border border-dashed border-border text-muted-foreground bg-transparent",
  REJECTED: "border border-foreground/30 text-foreground/60 bg-transparent",
  DELISTED: "border border-border text-muted-foreground/50 bg-transparent",
};

const channelStyles: Record<string, string> = {
  RELEASE: "border border-orange-500/30 bg-orange-500 text-white",
  BETA: "border border-orange-500/40 bg-orange-500/10 text-orange-500",
  ALPHA: "border border-border bg-transparent text-muted-foreground",
};

const platformIcons: Record<string, any> = {
  Fabric: Blocks,
  NeoForge: Package,
  Quilt: Layers,
  Forge: Package,
};

const TABS = [
  { key: "description", label: "Description" },
  { key: "gallery", label: "Gallery" },
  { key: "changelog", label: "Changelog" },
  { key: "versions", label: "Versions" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = (stored as "light" | "dark") || (prefersDark ? "dark" : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="border-border text-muted-foreground hover:text-foreground"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatDate = (date: any): string => {
    if (!date) return "-";
    if (typeof date === "object" && Object.keys(date).length === 0) return "-";
    if (typeof date === "string") {
      try {
        return format(new Date(date), "dd MMM yyyy", { locale: id });
      } catch {
        return date;
      }
    }
    return "-";
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  const downloadCount = Number(project.downloadCount) || 0;
  const followCount = project._count?.follows || 0;
  const reviewCount = project._count?.reviews || 0;
  const versionCount = project._count?.versions || 0;

  const latestVersion = project.versions?.[0];
  const loaders = latestVersion?.loaders?.map((l: any) => l.loader) || [];
  const gameVersions = latestVersion?.gameVersions?.map((gv: any) => gv.gameVersion) || [];
  const galleryPreview = project.gallery?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Top nav */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/discover">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "border-border text-muted-foreground hover:text-foreground",
                isFollowing && "text-red-500 border-red-500/30"
              )}
              onClick={() => setIsFollowing(!isFollowing)}
              aria-label="Follow"
            >
              <Heart className={cn("h-4 w-4", isFollowing && "fill-red-500")} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "border-border text-muted-foreground hover:text-foreground",
                isBookmarked && "text-orange-500 border-orange-500/30"
              )}
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark"
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-orange-500")} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-border text-muted-foreground hover:text-foreground"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-border text-muted-foreground hover:text-foreground"
              aria-label="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-card/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
            {/* Icon */}
            <div className="shrink-0">
              {project.iconUrl ? (
                <Image
                  src={project.iconUrl}
                  alt={project.name}
                  width={88}
                  height={88}
                  className="h-[88px] w-[88px] rounded-2xl border border-border bg-card object-cover"
                />
              ) : (
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-2xl bg-orange-500/10 text-4xl font-bold text-orange-500">
                  {project.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                <Badge className={cn("text-[11px]", statusStyles[project.status] || "bg-muted")}>
                  {project.status}
                </Badge>
              </div>

              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Download className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{formatNumber(downloadCount)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{formatNumber(followCount)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{reviewCount}</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Updated {formatDate(project.updatedAt)}
                </span>
              </div>

              {/* Tags - Category, Loaders, Game Versions */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {project.categories?.slice(0, 2).map((item: any) => (
                  <Badge key={item.category.id} variant="secondary" className="bg-secondary/60 text-xs">
                    {item.category.icon && <span className="mr-1">{item.category.icon}</span>}
                    {item.category.name}
                  </Badge>
                ))}
                {loaders.slice(0, 2).map((loader: any) => (
                  <Badge
                    key={loader.id}
                    variant="outline"
                    className="flex items-center gap-1 border-border text-xs text-muted-foreground"
                  >
                    <Blocks className="h-3 w-3" />
                    {loader.name}
                  </Badge>
                ))}
                {gameVersions.slice(0, 2).map((gv: any) => (
                  <Badge key={gv.id} className="bg-orange-500/15 text-xs text-orange-400">
                    {gv.version}
                  </Badge>
                ))}
                {gameVersions.length > 2 && (
                  <Badge className="bg-orange-500/15 text-xs text-orange-400">
                    +{gameVersions.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-orange-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {tab.key === "versions" && ` (${versionCount})`}
                {tab.key === "gallery" && ` (${project.gallery?.length || 0})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          {/* Content column */}
          <div className="min-w-0 space-y-6">
            {activeTab === "description" && (
              <>
                {/* Gallery preview strip */}
                {galleryPreview.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {galleryPreview.map((image: any) => (
                      <div
                        key={image.id}
                        className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <Image
                          src={image.url}
                          alt={image.caption || "Preview"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white/90">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Description body */}
                <div className="rounded-xl border border-border bg-card p-6">
                  {project.description ? (
                    <div
                      className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80
                        prose-headings:text-foreground prose-headings:font-bold
                        prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
                        prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                        prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                        prose-p:leading-relaxed prose-p:mb-3
                        prose-a:text-orange-500 prose-a:underline
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-3
                        prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-3
                        prose-li:mb-1
                        prose-blockquote:border-l-orange-500 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:my-3 prose-blockquote:bg-accent/50 prose-blockquote:rounded-r
                        prose-code:text-orange-500 prose-code:bg-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-accent prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-3
                        prose-img:rounded-lg prose-img:my-4 prose-img:border prose-img:border-border
                        prose-hr:border-border prose-hr:my-6"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground">No description available.</p>
                  )}

                  {loaders.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
                      {loaders.map((loader: any) => {
                        const Icon = platformIcons[loader.name] || Blocks;
                        return (
                          <Badge
                            key={loader.id}
                            variant="outline"
                            className="flex items-center gap-1.5 border-border px-2.5 py-1 text-xs text-foreground"
                          >
                            <Icon className="h-3.5 w-3.5 text-orange-500" />
                            Available for {loader.name}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "gallery" && (
              <div className="rounded-xl border border-border bg-card p-6">
                {!project.gallery || project.gallery.length === 0 ? (
                  <p className="text-muted-foreground">No images in gallery.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {project.gallery.map((image: any) => (
                      <div
                        key={image.id}
                        className="group relative aspect-video overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={image.url}
                          alt={image.caption || "Gallery image"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {image.isCover && (
                          <Badge className="absolute right-2 top-2 border-0 bg-orange-500 text-[10px] text-white">
                            Cover
                          </Badge>
                        )}
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                            {image.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "changelog" && (
              <div className="rounded-xl border border-border bg-card p-6">
                {!project.versions || project.versions.length === 0 ? (
                  <p className="text-muted-foreground">No changelog entries yet.</p>
                ) : (
                  <div className="space-y-6">
                    {project.versions.map((version: any) => (
                      <div key={version.id} className="border-b border-border pb-5 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {version.name || version.versionNumber}
                          </span>
                          <Badge className={cn("text-[11px]", channelStyles[version.channel] || "bg-muted")}>
                            {version.channel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(version.createdAt)}
                          </span>
                        </div>
                        {version.changelog && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {version.changelog}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {version.loaders?.slice(0, 2).map((l: any) => (
                            <Badge key={l.loader.id} variant="outline" className="border-border text-xs">
                              {l.loader.name}
                            </Badge>
                          ))}
                          {version.gameVersions?.slice(0, 2).map((gv: any) => (
                            <Badge key={gv.gameVersion.id} className="bg-orange-500/15 text-xs text-orange-400">
                              {gv.gameVersion.version}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "versions" && (
              <div className="rounded-xl border border-border bg-card p-6">
                {!project.versions || project.versions.length === 0 ? (
                  <p className="text-muted-foreground">No versions available.</p>
                ) : (
                  <div className="space-y-3">
                    {project.versions.map((version: any) => (
                      <div
                        key={version.id}
                        className="flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={cn("text-[11px]", channelStyles[version.channel] || "bg-muted")}>
                            {version.channel}
                          </Badge>
                          <div>
                            <p className="font-medium text-foreground">
                              {version.name || version.versionNumber}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(version.createdAt)}</span>
                              <span>&middot;</span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {formatNumber(version.downloadCount || 0)}
                              </span>
                              <span>&middot;</span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {version.files?.length || 0} files
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {version.loaders?.slice(0, 2).map((l: any) => (
                            <Badge key={l.loader.id} variant="outline" className="border-border text-xs">
                              {l.loader.name}
                            </Badge>
                          ))}
                          {version.gameVersions?.slice(0, 2).map((gv: any) => (
                            <Badge key={gv.gameVersion.id} variant="outline" className="border-orange-500/30 text-xs text-orange-500">
                              {gv.gameVersion.version}
                            </Badge>
                          ))}
                          {version.gameVersions?.length > 2 && (
                            <Badge variant="outline" className="border-orange-500/30 text-xs text-orange-500">
                              +{version.gameVersions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Compatibility */}
            {gameVersions.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Compatibility</h3>
                <p className="mb-2 text-xs text-muted-foreground">
                  Minecraft: {platformLabels[project.platform] || project.platform}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {gameVersions.map((gv: any) => (
                    <Badge key={gv.id} variant="outline" className="border-border text-xs text-foreground">
                      {gv.version}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Platforms */}
            {loaders.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Platforms</h3>
                <div className="flex flex-wrap gap-1.5">
                  {loaders.map((loader: any) => {
                    const Icon = platformIcons[loader.name] || Blocks;
                    return (
                      <Badge
                        key={loader.id}
                        variant="outline"
                        className="flex items-center gap-1.5 border-border text-xs text-foreground"
                      >
                        <Icon className="h-3.5 w-3.5 text-orange-500" />
                        {loader.name}
                      </Badge>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5" />
                  Client-side
                </div>
              </div>
            )}

            {/* Details */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Details</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium text-foreground">{project.type}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd className="font-medium text-foreground">{formatDate(project.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="font-medium text-foreground">{formatDate(project.updatedAt)}</dd>
                </div>
                {project.license && (
                  <div>
                    <dt className="text-muted-foreground">License</dt>
                    <dd className="font-medium text-foreground">
                      <a
                        href={project.license.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline"
                      >
                        {project.license.name}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Links */}
            {(project.sourceUrl || project.issuesUrl || project.wikiUrl || project.discordUrl || project.donationUrl) && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Links</h3>
                <div className="space-y-1">
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Code2 className="h-4 w-4" />
                      Source Code
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  )}
                  {project.issuesUrl && (
                    <a
                      href={project.issuesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Bug className="h-4 w-4" />
                      Issues
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  )}
                  {project.wikiUrl && (
                    <a
                      href={project.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <BookOpen className="h-4 w-4" />
                      Wiki
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  )}
                  {project.discordUrl && (
                    <a
                      href={project.discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Discord
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  )}
                  {project.donationUrl && (
                    <a
                      href={project.donationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Coffee className="h-4 w-4" />
                      Donate
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.categories?.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.categories.map((item: any) => (
                    <Badge key={item.category.id} variant="outline" className="border-border text-xs text-foreground">
                      {item.category.icon && <span className="mr-1">{item.category.icon}</span>}
                      {item.category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Creator */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {project.organization ? "Creators" : "Author"}
              </h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={project.author?.image || undefined} />
                  <AvatarFallback className="bg-orange-500/15 text-orange-500">
                    {project.author?.name?.charAt(0) || project.author?.username?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {project.author?.name || project.author?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">@{project.author?.username}</p>
                </div>
              </div>
              {project.organization && (
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm text-foreground">
                  <Users className="h-4 w-4 text-orange-500" />
                  {project.organization.name}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Reviews */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Reviews</h3>
              <p className="text-sm text-muted-foreground">{reviewCount} total reviews</p>
            </div>
            <Button className="bg-orange-500 text-white hover:bg-orange-600">Write a Review</Button>
          </div>
          <div className="mt-6 py-10 text-center text-muted-foreground">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        </div>
      </div>
    </div>
  );
}