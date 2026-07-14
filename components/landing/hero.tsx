import Link from "next/link";
import Image from "next/image";
import { Download, Users, Boxes, ArrowRight, Sparkles } from "lucide-react";

const categories = ["Mods", "Modpacks", "Shaders", "Plugins", "Maps"];

const stats = [
  { icon: Boxes, value: "18,400+", label: "Proyek terdaftar" },
  { icon: Download, value: "142M", label: "Total unduhan" },
  { icon: Users, value: "62,000+", label: "Kreator aktif" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Grid pattern halus */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      {/* Orange Glow */}
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-orange-600/20 blur-[130px]"
        aria-hidden
      />
      {/* Soft secondary glow biar tidak polos */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[380px] w-[380px] rounded-full bg-orange-500/10 blur-[130px]"
        aria-hidden
      />

      <div className="container relative mx-auto grid gap-12 px-4 py-24 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-6 lg:py-32">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
            </span>
            Kompatibel dengan Minecraft 1.21.4
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Platform terpercaya untuk{" "}
            <span className="relative inline-block text-orange-500">
              mod Minecraft
              <svg
                className="absolute -bottom-1 left-0 w-full text-orange-500/40"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0 5 Q50 0 100 4 T200 3"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            berkualitas.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Plugify menghadirkan ribuan mod, modpack, shader, plugin, dan map
            terkurasi dari komunitas, lengkap dengan informasi kompatibilitas
            versi sehingga proses instalasi menjadi lebih cepat dan bebas
            risiko.
          </p>

          {/* Popular Categories */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              Kategori populer:
            </span>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${category.toLowerCase()}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/40 hover:text-foreground hover:shadow-sm"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/discover"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-orange-600/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-orange-600/20"
            >
              Jelajahi Mods
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/40"
            >
              Lihat Modpack
            </Link>
          </div>

          {/* Stats */}
          <dl className="mt-12 grid grid-cols-3 divide-x divide-border border-t border-border pt-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col gap-1.5 pl-4 first:pl-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10">
                  <Icon className="h-4 w-4 text-orange-500" />
                </div>
                <dt className="text-xl font-bold text-foreground sm:text-2xl">
                  {value}
                </dt>
                <dd className="text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Banner Image Besar (Tanpa Background) */}
        <div className="relative hidden w-full items-center justify-center lg:flex lg:justify-end">
          <div
            className="absolute h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[100px]"
            aria-hidden
          />
          <Image
            src="/image/banner.png"
            alt="Minecraft Banner Character"
            width={800}
            height={800}
            className="relative h-auto w-full max-w-[500px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02] xl:max-w-[650px] 2xl:max-w-[700px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}