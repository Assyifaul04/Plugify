"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BuildingIcon,
  BoxesIcon,
  PackageIcon,
  BlocksIcon,
  TagsIcon,
  HourglassIcon,
  UsersIcon,
  MessageSquareWarningIcon,
  StarIcon,
  BellIcon,
  FolderHeartIcon,
  Settings2Icon,
} from "lucide-react"

// =========================================================
// Dashboard ini KHUSUS ADMIN. User biasa (role USER) tidak pernah
// masuk ke sini — mereka hanya browsing & download di halaman publik.
// Jadi tidak perlu lagi logika filter per-role (MODERATOR sudah dihapus
// dari enum UserRole di schema.prisma, tersisa USER dan ADMIN saja).
// Middleware/API route yang menjaga supaya hanya role === "ADMIN"
// yang bisa mengakses /dashboard.
// =========================================================
type AdminUser = {
  name: string
  email: string
  avatar?: string | null
  role: "ADMIN"
}

// =========================================================
// Data organisasi (model Organization) — untuk sekarang masih statis,
// idealnya di-fetch dari GET /api/organizations sesuai user yang login
// =========================================================
const organizations = [
  {
    name: "Plugify",
    logo: <BuildingIcon />,
    plan: "Platform Admin",
  },
  {
    name: "Terralith Team",
    logo: <BoxesIcon />,
    plan: "Owner",
  },
  {
    name: "Fabric Community",
    logo: <BlocksIcon />,
    plan: "Manager",
  },
]

// =========================================================
// Menu utama admin, mengikuti domain model di schema.prisma:
// Project (+type/status), Category/Tag/License/Loader/GameVersion,
// User/Organization, Report/Review, Notification/Collection
// =========================================================
const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      { title: "Ringkasan", url: "/dashboard" },
      { title: "Statistik Unduhan", url: "/dashboard/stats" },
    ],
  },
  {
    title: "Proyek",
    url: "/dashboard/projects",
    icon: <PackageIcon />,
    items: [
      { title: "Semua Proyek", url: "/dashboard/projects" },
      { title: "Mods", url: "/dashboard/projects?type=MOD" },
      { title: "Modpacks", url: "/dashboard/projects?type=MODPACK" },
      { title: "Shaders", url: "/dashboard/projects?type=SHADER" },
      { title: "Plugins", url: "/dashboard/projects?type=PLUGIN" },
      { title: "Resource Packs", url: "/dashboard/projects?type=RESOURCE_PACK" },
      { title: "Data Packs", url: "/dashboard/projects?type=DATA_PACK" },
      { title: "Maps", url: "/dashboard/projects?type=MAP" },
      { title: "Menunggu Review", url: "/dashboard/projects?status=PENDING_REVIEW" },
      { title: "Upload Proyek Baru", url: "/dashboard/projects/new" },
    ],
  },
  {
    title: "Versi & File",
    url: "/dashboard/versions",
    icon: <BoxesIcon />,
    items: [
      { title: "Semua Versi", url: "/dashboard/versions" },
      { title: "Upload Versi Baru", url: "/dashboard/versions/new" },
      { title: "Release", url: "/dashboard/versions?channel=RELEASE" },
      { title: "Beta", url: "/dashboard/versions?channel=BETA" },
      { title: "Alpha", url: "/dashboard/versions?channel=ALPHA" },
    ],
  },
  {
    title: "Taksonomi",
    url: "/dashboard/taxonomy",
    icon: <TagsIcon />,
    items: [
      { title: "Kategori", url: "/dashboard/categories" },
      { title: "Tag", url: "/dashboard/tags" },
      { title: "Lisensi", url: "/dashboard/licenses" },
      { title: "Loader", url: "/dashboard/loaders" },
      { title: "Versi Game", url: "/dashboard/game-versions" },
    ],
  },
  {
    title: "Komunitas",
    url: "/dashboard/community",
    icon: <UsersIcon />,
    items: [
      { title: "Pengguna", url: "/dashboard/users" },
      { title: "Organisasi", url: "/dashboard/organizations" },
      { title: "Ulasan", url: "/dashboard/reviews" },
      { title: "Laporan", url: "/dashboard/reports" },
    ],
  },
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: <Settings2Icon />,
    items: [
      { title: "Umum", url: "/dashboard/settings" },
      { title: "Role & Izin", url: "/dashboard/settings/roles" },
      { title: "Notifikasi Sistem", url: "/dashboard/settings/notifications" },
    ],
  },
]

// Pintasan moderasi harian — antrian review & laporan yang perlu ditindak admin
const quickLinks = [
  {
    name: "Antrian Review",
    url: "/dashboard/projects?status=PENDING_REVIEW",
    icon: <HourglassIcon />,
  },
  {
    name: "Laporan Masuk",
    url: "/dashboard/reports?status=OPEN",
    icon: <MessageSquareWarningIcon />,
  },
  {
    name: "Ulasan Terbaru",
    url: "/dashboard/reviews?sort=recent",
    icon: <StarIcon />,
  },
  {
    name: "Notifikasi",
    url: "/dashboard/notifications",
    icon: <BellIcon />,
  },
  {
    name: "Koleksi Publik",
    url: "/dashboard/collections",
    icon: <FolderHeartIcon />,
  },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: AdminUser
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={organizations} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={quickLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Admin",
            email: user?.email ?? "admin@plugify.dev",
            avatar: user?.avatar ?? "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}