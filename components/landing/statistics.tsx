"use client";

import { useEffect, useRef, useState } from "react";
import { Boxes, Download, Users, Gamepad2 } from "lucide-react";

const stats = [
  { icon: Boxes, target: 18400, suffix: "+", label: "Proyek terdaftar" },
  { icon: Download, target: 142, suffix: "M", label: "Total unduhan" },
  { icon: Users, target: 62000, suffix: "+", label: "Kreator aktif" },
  { icon: Gamepad2, target: 2100000, suffix: "+", label: "Server terhubung" },
];

function StatNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const duration = 1400;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            const label =
              target >= 1000000
                ? (current / 1000000).toFixed(1).replace(/\.0$/, "")
                : target >= 1000
                ? (current / 1000).toFixed(0)
                : Math.round(current).toString();

            setDisplay(
              target >= 1000000
                ? label
                : target >= 1000
                ? label + "K"
                : label
            );

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card">
      {/* Decorative Blur */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[100px]"
        aria-hidden
      />

      <div className="container relative mx-auto px-4 py-14 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dipercaya komunitas Minecraft
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Angka ini tumbuh setiap hari lewat kontribusi ribuan kreator dan
            jutaan pemain.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-y-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
          {stats.map(({ icon: Icon, target, suffix, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-4 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                <StatNumber target={target} suffix={suffix} />
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}