import type { Metadata } from "next";

export const siteConfig = {
  name: "PLUGIFY",
  description:
    "Discover, download and publish Minecraft Mods, Modpacks, Resource Packs, Plugins and more.",
  url: "https://localhost:3000",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};