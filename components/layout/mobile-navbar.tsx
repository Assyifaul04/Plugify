"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  "Mods",
  "Modpacks",
  "Plugins",
  "Shaders",
  "Maps",
];

export default function MobileNavbar() {
  return (
    <Sheet>
      {/* HAPUS komponen <Button> di sini. 
        Biarkan <SheetTrigger> menjadi satu-satunya tombol utama, 
        lalu sematkan kelas utilitas Tailwind untuk menentukan ukurannya.
      */}
      <SheetTrigger className="group inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
        <Menu className="size-5" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>

      <SheetContent side="left">
        <div className="mt-8 flex flex-col gap-5">
          {links.map((item) => (
            <Link
              key={item}
              href="/"
              className="text-lg"
            >
              {item}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}