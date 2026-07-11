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
  // Penambahan logo untuk favicon dan preview sosial media
  icons: {
    icon: "/image/logo.svg",
    shortcut: "/image/logo.svg",
    apple: "/image/logo.svg",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/image/logo.svg", 
        width: 512,
        height: 512,
        alt: "PLUGIFY Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/image/logo.svg"],
  },
};