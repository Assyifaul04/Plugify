import Link from "next/link";
import { Wrench, Package, Sparkles, Plug, MapIcon, ArrowRight } from "lucide-react";

const categories = [
  {
    label: "Mods",
    href: "/mods",
    count: "9,200+",
    icon: Wrench,
    accent: "text-emerald-600 dark:text-emerald-400",
    glow: "group-hover:bg-emerald-500/10",
  },
  {
    label: "Modpacks",
    href: "/modpacks",
    count: "1,850+",
    icon: Package,
    accent: "text-orange-600 dark:text-orange-400",
    glow: "group-hover:bg-orange-500/10",
  },
  {
    label: "Shaders",
    href: "/shaders",
    count: "620+",
    icon: Sparkles,
    accent: "text-sky-600 dark:text-sky-400",
    glow: "group-hover:bg-sky-500/10",
  },
  {
    label: "Plugins",
    href: "/plugins",
    count: "4,100+",
    icon: Plug,
    accent: "text-violet-600 dark:text-violet-400",
    glow: "group-hover:bg-violet-500/10",
  },
  {
    label: "Maps",
    href: "/maps",
    count: "2,630+",
    icon: MapIcon,
    accent: "text-amber-600 dark:text-amber-400",
    glow: "group-hover:bg-amber-500/10",
  },
];

export default function Categories() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Jelajahi berdasarkan kategori
          </h2>
          <Link
            href="/mods"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            Lihat katalog lengkap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ label, href, count, icon: Icon, accent, glow }) => (
            <Link
              key={label}
              href={href}
              className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-colors ${glow}`}
                aria-hidden
              />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
                <Icon className={`h-5 w-5 text-muted-foreground transition-colors group-hover:${accent.split(' ')[0]} ${accent}`} />
              </div>

              <div className="relative">
                <h3 className="text-base font-semibold text-card-foreground">
                  {label}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {count} proyek
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/mods"
          className="mt-6 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden"
        >
          Lihat katalog lengkap
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}