import Link from "next/link";
import { Sparkles } from "lucide-react";

const launchers = [
  {
    name: "ATLauncher",
    gradient: "from-fuchsia-500 via-orange-400 to-yellow-400",
  },
  {
    name: "MultiMC",
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Prism Launcher",
    gradient: "from-lime-400 to-lime-600",
  },
];

export default function FavoriteLauncher() {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-10">
          {/* Left: Text */}
          <div className="max-w-lg">
            <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Mainkan dengan launcher favoritmu
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              API open-source Plugify memungkinkan launcher melakukan
              integrasi mendalam dengan Plugify. Kamu bisa menggunakan Plugify
              lewat{" "}
              <Link
                href="/app"
                className="text-foreground underline underline-offset-4 hover:text-orange-500"
              >
                aplikasi kami sendiri
              </Link>{" "}
              dan beberapa launcher populer seperti ATLauncher, MultiMC, dan
              Prism Launcher.
            </p>
          </div>

          {/* Right: Window mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl dark:shadow-black/40">
              {/* Title bar */}
              <div className="relative flex items-center justify-center border-b border-border bg-secondary/60 px-4 py-2.5">
                <div className="absolute left-4 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Minecraft 1.19.3
                </span>
              </div>

              {/* Splash screen */}
              <div className="flex flex-col items-center justify-center gap-4 bg-secondary/30 px-6 py-14">
                <div className="flex flex-col items-center">
                  <span className="flex items-center gap-1.5 text-2xl font-black tracking-tight text-emerald-500 sm:text-3xl">
                    <Sparkles className="h-6 w-6" />
                    MOJANG
                  </span>
                  <span className="mt-0.5 text-[11px] font-bold tracking-[0.3em] text-emerald-500/90">
                    STUDIOS
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-64 max-w-full overflow-hidden rounded-full bg-emerald-500/20">
                  <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Launcher icons */}
              <div className="grid grid-cols-3 gap-3 border-t border-border bg-card p-3">
                {launchers.map((launcher) => (
                  <button
                    key={launcher.name}
                    title={launcher.name}
                    className="flex items-center justify-center rounded-xl border border-border bg-secondary/40 py-4 transition-colors hover:border-orange-500/40 hover:bg-secondary/70"
                  >
                    <span
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${launcher.gradient}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-[100px]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}