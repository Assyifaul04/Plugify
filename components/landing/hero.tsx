import Link from "next/link";
import { Search, Download, Users, Boxes, ArrowRight } from "lucide-react";

const categories = ["Mods", "Modpacks", "Shaders", "Plugins", "Maps"];

const stats = [
  { icon: Boxes, value: "18,400+", label: "Projects listed" },
  { icon: Download, value: "142M", label: "Total downloads" },
  { icon: Users, value: "62,000+", label: "Active creators" },
];

const previewCards = [
  {
    title: "Terralith",
    author: "stardustlabs",
    downloads: "8.1M",
    tag: "Worldgen",
  },
  {
    title: "Xaero's Minimap",
    author: "xaero96",
    downloads: "12.4M",
    tag: "Utility",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Orange Glow */}
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-orange-600/20 blur-[120px]"
        aria-hidden
      />
      {/* Soft secondary glow biar tidak polos */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[380px] w-[380px] rounded-full bg-orange-500/10 blur-[130px]"
        aria-hidden
      />

      <div className="container relative mx-auto grid gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-6 lg:py-28">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Kompatibel dengan Minecraft 1.21.4
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Temukan mod Minecraft yang{" "}
            <span className="text-orange-500">tepat</span>, tanpa drama.
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Plugify menghimpun ribuan mod, modpack, shader, plugin, dan map
            pilihan komunitas — lengkap dengan info kompatibilitas versi,
            supaya kamu tidak perlu tebak-tebakan sebelum install.
          </p>

          <div className="mt-8">
            {/* Search Box */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-1.5 pl-4 focus-within:border-orange-500/50">
              <Search className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari mod, modpack, atau shader..."
                className="w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500">
                Cari
              </button>
            </div>

            {/* Popular Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Populer:
              </span>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/${category.toLowerCase()}`}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-orange-500/40 hover:text-foreground"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex items-center gap-3">
            <Link
              href="/mods"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Jelajahi Mods
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/create"
              className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Upload proyekmu
            </Link>
          </div>

          {/* Stats */}
          <dl className="mt-12 grid grid-cols-3 divide-x divide-border border-t border-border pt-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col gap-1 pl-4 first:pl-0">
                <Icon className="h-4 w-4 text-orange-500" />
                <dt className="text-xl font-bold text-foreground">{value}</dt>
                <dd className="text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Floating Cards */}
        <div className="relative hidden h-[420px] lg:block">
          <div className="absolute right-8 top-8 w-72 -rotate-3 rounded-2xl border border-border bg-card/80 p-4 shadow-xl backdrop-blur [animation:float_6s_ease-in-out_infinite] dark:shadow-black/40">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-card-foreground">
                  {previewCards[0].title}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {previewCards[0].author}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {previewCards[0].tag}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                {previewCards[0].downloads}
              </span>
            </div>
          </div>

          <div className="absolute right-32 top-44 w-72 rotate-2 rounded-2xl border border-border bg-card/90 p-4 shadow-xl backdrop-blur [animation:float_7s_ease-in-out_infinite] [animation-delay:0.8s] dark:shadow-black/40">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-card-foreground">
                  {previewCards[1].title}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {previewCards[1].author}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {previewCards[1].tag}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                {previewCards[1].downloads}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-10px) rotate(var(--tw-rotate)); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}