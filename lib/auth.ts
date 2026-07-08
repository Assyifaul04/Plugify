import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // Wajib "jwt" (bukan "database") supaya middleware bisa membaca role
  // lewat getToken() di edge runtime tanpa perlu query ke database.
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Intersepsi data profil Google sebelum disimpan ke DB oleh Adapter
      profile(profile) {
        // Membuat username dasar unik dari email (misal: tapirstudio6@gmail.com -> tapirstudio6_12345)
        const emailName = profile.email.split("@")[0];
        const randomSuffix = Math.floor(10000 + Math.random() * 90000); // 5 digit acak

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: `${emailName}_${randomSuffix}`, // <-- Menyisipkan username wajib untuk Prisma
          role: "USER", // Menyesuaikan default role
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

  callbacks: {
    // Dipanggil saat sign in, dan setiap kali token dibaca ulang oleh NextAuth
    async jwt({ token, user }) {
      if (user) {
        // `user` hanya ada sekali, tepat setelah proses sign in berhasil
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        return token;
      }

      // Sinkronkan ulang role dari database di request berikutnya,
      // supaya kalau admin mengubah role seseorang, perubahan langsung berlaku
      // tanpa user harus logout dulu.
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    // Sisipkan id & role ke object session supaya bisa dipakai di client/server component
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
