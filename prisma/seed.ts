import { PrismaClient, ProjectType, GamePlatform } from "@prisma/client"

const prisma = new PrismaClient()

// =========================================================
// KATEGORI
// Setiap kategori punya `projectTypes` untuk menandai proyek jenis apa
// saja yang relevan menampilkan kategori ini (mengikuti pola Modrinth).
// =========================================================
const categories: {
  name: string
  slug: string
  icon?: string
  projectTypes: ProjectType[]
}[] = [
  // --- Cocok untuk Mod & Modpack ---
  { name: "Adventure", slug: "adventure", projectTypes: ["MOD", "MODPACK"] },
  { name: "Magic", slug: "magic", projectTypes: ["MOD", "MODPACK"] },
  { name: "Technology", slug: "technology", projectTypes: ["MOD", "MODPACK"] },
  { name: "Storage", slug: "storage", projectTypes: ["MOD", "MODPACK"] },
  { name: "World Generation", slug: "world-generation", projectTypes: ["MOD", "MODPACK", "DATA_PACK"] },
  { name: "Mobs", slug: "mobs", projectTypes: ["MOD", "MODPACK"] },
  { name: "Food", slug: "food", projectTypes: ["MOD", "MODPACK"] },
  { name: "Equipment", slug: "equipment", projectTypes: ["MOD", "MODPACK"] },
  { name: "Decoration", slug: "decoration", projectTypes: ["MOD", "MODPACK", "RESOURCE_PACK"] },
  { name: "Game Mechanics", slug: "game-mechanics", projectTypes: ["MOD", "MODPACK"] },
  { name: "Library", slug: "library", projectTypes: ["MOD"] },
  { name: "Optimization", slug: "optimization", projectTypes: ["MOD", "MODPACK"] },
  { name: "Utility", slug: "utility", projectTypes: ["MOD", "MODPACK", "PLUGIN"] },
  { name: "Transportation", slug: "transportation", projectTypes: ["MOD", "MODPACK"] },
  { name: "Cursed", slug: "cursed", projectTypes: ["MOD", "MODPACK"] },

  // --- Modpack-spesifik ---
  { name: "Combat", slug: "combat", projectTypes: ["MODPACK"] },
  { name: "Exploration", slug: "exploration", projectTypes: ["MODPACK"] },
  { name: "Multiplayer", slug: "multiplayer", projectTypes: ["MODPACK", "PLUGIN"] },
  { name: "Quests", slug: "quests", projectTypes: ["MODPACK"] },
  { name: "Vanilla+", slug: "vanilla-plus", projectTypes: ["MODPACK", "DATA_PACK"] },
  { name: "Lightweight", slug: "lightweight", projectTypes: ["MODPACK"] },

  // --- Shader-spesifik ---
  { name: "Realistic", slug: "realistic", projectTypes: ["SHADER"] },
  { name: "Fantasy", slug: "fantasy", projectTypes: ["SHADER", "RESOURCE_PACK"] },
  { name: "Cartoon", slug: "cartoon", projectTypes: ["SHADER", "RESOURCE_PACK"] },
  { name: "Vibrant", slug: "vibrant", projectTypes: ["SHADER"] },
  { name: "Low-Spec", slug: "low-spec", projectTypes: ["SHADER"] },

  // --- Plugin-spesifik ---
  { name: "Economy", slug: "economy", projectTypes: ["PLUGIN"] },
  { name: "Management", slug: "management", projectTypes: ["PLUGIN"] },
  { name: "Minigame", slug: "minigame", projectTypes: ["PLUGIN", "MAP"] },
  { name: "Social", slug: "social", projectTypes: ["PLUGIN"] },
  { name: "Anti-Griefing", slug: "anti-griefing", projectTypes: ["PLUGIN"] },
  { name: "Chat", slug: "chat", projectTypes: ["PLUGIN"] },

  // --- Resource Pack / Map ---
  { name: "Medieval", slug: "medieval", projectTypes: ["RESOURCE_PACK", "MAP"] },
  { name: "Modern", slug: "modern", projectTypes: ["RESOURCE_PACK", "MAP"] },
  { name: "Simplistic", slug: "simplistic", projectTypes: ["RESOURCE_PACK"] },
  { name: "16x", slug: "16x", projectTypes: ["RESOURCE_PACK"] },
  { name: "32x", slug: "32x", projectTypes: ["RESOURCE_PACK"] },
  { name: "64x", slug: "64x", projectTypes: ["RESOURCE_PACK"] },
  { name: "Puzzle", slug: "puzzle", projectTypes: ["MAP"] },
  { name: "Parkour", slug: "parkour", projectTypes: ["MAP"] },
  { name: "Survival Map", slug: "survival-map", projectTypes: ["MAP"] },
]

// =========================================================
// TAG (bebas/freeform, dipakai lintas kategori untuk pencarian)
// =========================================================
const tags = [
  "singleplayer",
  "multiplayer",
  "server-side",
  "client-side",
  "hardcore",
  "vanilla-like",
  "kitchen-sink",
  "performance",
  "config-heavy",
  "no-config",
  "family-friendly",
  "pvp",
  "pve",
  "roleplay",
  "building",
  "farming",
  "redstone",
  "dimension",
  "boss-fight",
  "seasonal",
]

// =========================================================
// LISENSI
// =========================================================
const licenses = [
  { name: "MIT License", spdxId: "MIT", url: "https://opensource.org/licenses/MIT" },
  { name: "Apache License 2.0", spdxId: "Apache-2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
  { name: "GNU GPL v3.0", spdxId: "GPL-3.0", url: "https://www.gnu.org/licenses/gpl-3.0.html" },
  { name: "GNU LGPL v3.0", spdxId: "LGPL-3.0", url: "https://www.gnu.org/licenses/lgpl-3.0.html" },
  { name: "Mozilla Public License 2.0", spdxId: "MPL-2.0", url: "https://www.mozilla.org/en-US/MPL/2.0/" },
  { name: "Creative Commons Zero v1.0", spdxId: "CC0-1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
  { name: "Creative Commons Attribution 4.0", spdxId: "CC-BY-4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
  { name: "Creative Commons Attribution-ShareAlike 4.0", spdxId: "CC-BY-SA-4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
  { name: "The Unlicense", spdxId: "Unlicense", url: "https://unlicense.org/" },
  { name: "All Rights Reserved", spdxId: null, url: null },
]

// =========================================================
// LOADER
// =========================================================
const loaders: {
  name: string
  platform: GamePlatform
  supportedTypes: ProjectType[]
}[] = [
  { name: "fabric", platform: "JAVA", supportedTypes: ["MOD", "MODPACK"] },
  { name: "forge", platform: "JAVA", supportedTypes: ["MOD", "MODPACK"] },
  { name: "neoforge", platform: "JAVA", supportedTypes: ["MOD", "MODPACK"] },
  { name: "quilt", platform: "JAVA", supportedTypes: ["MOD", "MODPACK"] },
  { name: "spigot", platform: "JAVA", supportedTypes: ["PLUGIN"] },
  { name: "paper", platform: "JAVA", supportedTypes: ["PLUGIN"] },
  { name: "purpur", platform: "JAVA", supportedTypes: ["PLUGIN"] },
  { name: "bungeecord", platform: "JAVA", supportedTypes: ["PLUGIN"] },
  { name: "velocity", platform: "JAVA", supportedTypes: ["PLUGIN"] },
  { name: "sponge", platform: "JAVA", supportedTypes: ["PLUGIN", "MOD"] },
  { name: "iris", platform: "JAVA", supportedTypes: ["SHADER"] },
  { name: "optifine", platform: "JAVA", supportedTypes: ["SHADER", "RESOURCE_PACK"] },
  { name: "bedrock-addon", platform: "BEDROCK", supportedTypes: ["MOD", "RESOURCE_PACK", "MAP"] },
  { name: "datapack", platform: "JAVA", supportedTypes: ["DATA_PACK"] },
]

// =========================================================
// GAME VERSION
// =========================================================
const gameVersions: {
  version: string
  platform: GamePlatform
  isMajor: boolean
  isBeta?: boolean
}[] = [
  // Java — rilis mayor terbaru ke lama
  { version: "1.21.4", platform: "JAVA", isMajor: true },
  { version: "1.21.3", platform: "JAVA", isMajor: false },
  { version: "1.21.1", platform: "JAVA", isMajor: false },
  { version: "1.21", platform: "JAVA", isMajor: true },
  { version: "1.20.6", platform: "JAVA", isMajor: false },
  { version: "1.20.4", platform: "JAVA", isMajor: true },
  { version: "1.20.1", platform: "JAVA", isMajor: true },
  { version: "1.19.4", platform: "JAVA", isMajor: true },
  { version: "1.19.2", platform: "JAVA", isMajor: false },
  { version: "1.18.2", platform: "JAVA", isMajor: true },
  { version: "1.17.1", platform: "JAVA", isMajor: true },
  { version: "1.16.5", platform: "JAVA", isMajor: true },
  { version: "1.12.2", platform: "JAVA", isMajor: true },
  { version: "1.8.9", platform: "JAVA", isMajor: true },
  { version: "25w03a", platform: "JAVA", isMajor: false, isBeta: true },

  // Bedrock
  { version: "1.21.50", platform: "BEDROCK", isMajor: true },
  { version: "1.21.0", platform: "BEDROCK", isMajor: true },
  { version: "1.20.80", platform: "BEDROCK", isMajor: false },
  { version: "1.20.10", platform: "BEDROCK", isMajor: true },
  { version: "1.19.80", platform: "BEDROCK", isMajor: true },
]

async function main() {
  console.log("Seeding categories...")
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        projectTypes: category.projectTypes,
      },
      create: category,
    })
  }

  console.log("Seeding tags...")
  for (const name of tags) {
    const slug = name
    await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    })
  }

  console.log("Seeding licenses...")
  for (const license of licenses) {
    // "All Rights Reserved" tidak punya spdxId, jadi upsert berdasarkan name
    await prisma.license.upsert({
      where: { name: license.name },
      update: { spdxId: license.spdxId, url: license.url },
      create: license,
    })
  }

  console.log("Seeding loaders...")
  for (const loader of loaders) {
    await prisma.loader.upsert({
      where: { name: loader.name },
      update: {
        platform: loader.platform,
        supportedTypes: loader.supportedTypes,
      },
      create: loader,
    })
  }

  console.log("Seeding game versions...")
  for (const gv of gameVersions) {
    await prisma.gameVersion.upsert({
      where: { version: gv.version },
      update: {
        platform: gv.platform,
        isMajor: gv.isMajor,
        isBeta: gv.isBeta ?? false,
      },
      create: {
        version: gv.version,
        platform: gv.platform,
        isMajor: gv.isMajor,
        isBeta: gv.isBeta ?? false,
      },
    })
  }

  console.log("Seed selesai ✅")
  console.log(
    `- ${categories.length} kategori\n- ${tags.length} tag\n- ${licenses.length} lisensi\n- ${loaders.length} loader\n- ${gameVersions.length} game version`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })