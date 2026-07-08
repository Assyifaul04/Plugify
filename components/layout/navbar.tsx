"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  Crown,
  Download,
  LogIn,
  LogOut,
  MoreVertical,
  Settings,
  User as UserIcon,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./theme-toggle";
import MobileNavbar from "./mobile-navbar";

const menus = [
  {
    label: "Browse",
    items: [
      { label: "Mods", href: "/mods" },
      { label: "Modpacks", href: "/modpacks" },
      { label: "Shaders", href: "/shaders" },
      { label: "Plugins", href: "/plugins" },
      { label: "Maps", href: "/maps" },
    ],
  },
  {
    label: "Create",
    items: [
      { label: "Upload a project", href: "/create/upload" },
      { label: "Developer docs", href: "/docs" },
    ],
  },
  {
    label: "Studios",
    items: [
      { label: "Browse studios", href: "/studios" },
      { label: "Create a studio", href: "/studios/new" },
    ],
  },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            href="/"
            className="mr-6 flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Plugify, kembali ke beranda"
          >
            <Image
              src="/image/logo.svg"
              alt="Plugify"
              width={40}
              height={40}
              priority
              className="h-10 w-auto"
            />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Plugify
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {menus.map((menu) => {
              const isActive = menu.items.some(
                (item) => item.href === pathname,
              );
              return (
                <DropdownMenu key={menu.label}>
                  <DropdownMenuTrigger
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {menu.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="border-border bg-popover text-popover-foreground"
                  >
                    {menu.items.map((item) => (
                      <DropdownMenuItem
                        key={item.href}
                        onClick={() => router.push(item.href)}
                        className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Button
            variant="outline"
            className="gap-1.5 border-border bg-transparent text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Crown className="h-4 w-4 text-orange-400" />
            Go Premium
          </Button>

          <Button className="gap-1.5 bg-orange-600 text-sm font-semibold text-white hover:bg-orange-500 dark:text-white">
            <Download className="h-4 w-4" />
            Get Plugify App
          </Button>

          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex h-9 w-9 items-center justify-center rounded-full outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                aria-label="Menu akun"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Akun"} />
                  <AvatarFallback className="bg-orange-600 text-xs font-semibold text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 border-border bg-popover p-1 text-popover-foreground"
              >
                {/* Menggunakan div khusus pengganti DropdownMenuLabel untuk menghindari bug Context */}
                <div className="flex flex-col px-2 py-1.5 text-sm font-medium">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                {/* Pembatas div pengganti DropdownMenuSeparator */}
                <div className="-mx-1 my-1 h-px bg-border" />

                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer flex items-center gap-2 focus:bg-accent focus:text-accent-foreground"
                >
                  <UserIcon className="h-4 w-4" />
                  Profil
                </DropdownMenuItem>

                {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer flex items-center gap-2 focus:bg-accent focus:text-accent-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer flex items-center gap-2 focus:bg-accent focus:text-accent-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </DropdownMenuItem>

                <div className="-mx-1 my-1 h-px bg-border" />

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="gap-1.5 border-border bg-transparent text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => router.push("/login")}
            >
              Sign In
              <LogIn className="h-4 w-4" />
            </Button>
          )}

          <div className="ml-1 h-5 w-px bg-border" aria-hidden />

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-orange-500">
              <MoreVertical className="h-4.5 w-4.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-border bg-popover text-popover-foreground"
            >
              <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                Bahasa
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                Bantuan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="lg:hidden">
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
}