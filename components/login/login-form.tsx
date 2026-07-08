"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    // callbackUrl "/" -> setelah login sukses diarahkan ke landing page.
    // Middleware yang menentukan: kalau role admin/moderator, otomatis
    // dilempar lagi ke /dashboard; kalau user biasa, tetap di "/".
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-secondary/50">
                <Image
                  src="/image/logo.svg"
                  alt="Plugify"
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-auto"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Plugify
              </span>
            </a>
            <h1 className="text-xl font-bold text-foreground">
              Selamat datang kembali
            </h1>
            <FieldDescription>
              Belum punya akun?{" "}
              <a
                href="/register"
                className="font-medium text-orange-500 hover:text-orange-400"
              >
                Daftar
              </a>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="nama@contoh.com"
              required
              className="focus-visible:border-orange-500/60 focus-visible:ring-orange-500/20"
            />
          </Field>

          <Field>
            <Button
              type="submit"
              className="bg-orange-600 text-white hover:bg-orange-500"
            >
              Login
            </Button>
          </Field>

          <FieldSeparator>Atau</FieldSeparator>

          <Field>
            <Button
              variant="outline"
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              className="border-border bg-background text-foreground transition-colors hover:border-orange-500/50 hover:bg-secondary hover:text-foreground"
            >
              {isGoogleLoading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-4"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              )}
              Lanjutkan dengan Google
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Dengan melanjutkan, kamu menyetujui{" "}
        <a
          href="/terms"
          className="text-foreground underline underline-offset-4 hover:text-orange-500"
        >
          Syarat Layanan
        </a>{" "}
        dan{" "}
        <a
          href="/privacy"
          className="text-foreground underline underline-offset-4 hover:text-orange-500"
        >
          Kebijakan Privasi
        </a>{" "}
        kami.
      </FieldDescription>
    </div>
  );
}
