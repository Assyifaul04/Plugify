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
  ShieldIcon,
  BoxesIcon,
  PackageIcon,
  BlocksIcon,
  SparklesIcon,
  PlugIcon,
  ImageIcon,
  DatabaseIcon,
  MapIcon,
  HourglassIcon,
  TagsIcon,
  FolderTreeIcon,
  ScrollTextIcon,
  LayersIcon,
  GitBranchIcon,
  UsersIcon,
  MessageSquareWarningIcon,
  StarIcon,
  BellIcon,
  FolderHeartIcon,
  Settings2Icon,
} from "lucide-react"

// =========================================================
// Tipe user yang login ke dashboard admin (dari session NextAuth)
// role menentukan menu mana yang tampil, sesuai enum UserRole di schema.prisma
// =========================================================
type AdminUser = {
  name: string
  email: string
  avatar?: string | null
  role: "ADMIN" | "MODERATOR" | "USER"
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
// Menu utama, dikelompokkan sesuai domain model di schema.prisma:
// Project (+type), Category/Tag/License/Loader/GameVersion, User/Organization,
// Report/Review, Notification/Collection
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

// Menu tambahan khusus role MODERATOR ke atas (moderasi konten)
const navModeration = [
  {
    title: "Antrian Review",
    url: "/dashboard/projects?status=PENDING_REVIEW",
    icon: <HourglassIcon />,
  },
  {
    title: "Laporan Masuk",
    url: "/dashboard/reports?status=OPEN",
    icon: <MessageSquareWarningIcon />,
  },
]

// Menu tambahan khusus ADMIN (data master & manajemen akun)
const navAdminOnly = [
  {
    title: "Manajemen Pengguna",
    url: "/dashboard/users",
    icon: <UsersIcon />,
  },
  {
    title: "Organisasi",
    url: "/dashboard/organizations",
    icon: <BuildingIcon />,
  },
]

// "Quick links" gaya section proyek — di sini dipetakan ke pintasan
// yang sering dipakai admin/moderator sehari-hari
const quickLinks = [
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
  const role = user?.role ?? "USER"

  // Susun menu dinamis sesuai role, mengikuti enum UserRole (USER/MODERATOR/ADMIN) di schema
  const items = React.useMemo(() => {
    const base = navMain.filter((section) => {
      if (section.title === "Komunitas" || section.title === "Pengaturan") {
        return role === "ADMIN" || role === "MODERATOR"
      }
      return true
    })

    return base.map((section) => {
      if (section.title === "Komunitas" && role !== "ADMIN") {
        // MODERATOR tidak melihat "Pengguna" & "Organisasi", hanya moderasi
        return {
          ...section,
          items: section.items.filter(
            (i) => i.title === "Ulasan" || i.title === "Laporan",
          ),
        }
      }
      if (section.title === "Pengaturan" && role !== "ADMIN") {
        return {
          ...section,
          items: section.items.filter((i) => i.title === "Umum"),
        }
      }
      return section
    })
  }, [role])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={organizations} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
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