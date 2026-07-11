"use client";

import { Button } from "@/components/ui/button";
import { Rocket, Sparkles } from "lucide-react";

export default function DiscoverBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-black via-neutral-900 to-orange-500 p-6 md:p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Sponsored
            </span>
          </div>
          <h2 className="text-xl font-bold text-white md:text-2xl">
            Host your next server with{" "}
            <span className="text-orange-400">Plugify Hosting</span>
          </h2>
          <p className="text-sm text-white/70">
            Get 5 days free with Medal:{" "}
            <span className="font-mono text-orange-300">plugify.host/medal</span>
          </p>
        </div>
        <Button
          variant="secondary"
          className="bg-white text-black hover:bg-white/90"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Claim Offer
        </Button>
      </div>
    </div>
  );
}