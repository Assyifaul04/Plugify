"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DiscoverBanner() {
  return (
    <Card className="mb-4 overflow-hidden border border-border bg-gradient-to-br from-orange-500/10 via-card to-purple-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-orange-500/20 p-2">
          <Sparkles className="h-4 w-4 text-orange-400" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">Discover New Mods</h3>
          <p className="text-xs text-muted-foreground">
            Explore the latest and greatest Minecraft mods, shaders, and more.
          </p>
          <Link href="/discover?sort=popular">
            <Button size="sm" className="mt-1 h-7 rounded-full bg-orange-500 px-3 text-xs text-white hover:bg-orange-600">
              Trending Now
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}