import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabase, DEV_MODE } from "@/lib/supabase/client";

const nextAuth = DEV_MODE
  ? null
  : NextAuth({
      providers: [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],
      pages: {
        signIn: "/admin/login",
      },
      callbacks: {
        async signIn({ user }) {
          if (!user.email) return false;

          // Already in the allowlist?
          const { data: existing } = await supabase
            .from("shop_users")
            .select("id")
            .eq("email", user.email)
            .maybeSingle();

          if (existing) return true;

          // Bootstrap: if this email matches OWNER_EMAIL, auto-add as owner
          const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase().trim();
          if (ownerEmail && user.email.toLowerCase() === ownerEmail) {
            await supabase.from("shop_users").insert({
              email: user.email,
              name: user.name || null,
              role: "owner",
            });
            return true;
          }

          return false;
        },
        async session({ session }) {
          if (session.user?.email) {
            const { data } = await supabase
              .from("shop_users")
              .select("role")
              .eq("email", session.user.email)
              .maybeSingle();

            if (data) {
              (session.user as unknown as Record<string, unknown>).role =
                data.role;
            }
          }
          return session;
        },
      },
    });

// In dev mode, return mock session / no-op functions
const mockSession = {
  user: { name: "Dev User", email: "dev@localhost", role: "owner" },
  expires: "2099-01-01T00:00:00Z",
};

export const handlers = nextAuth?.handlers ?? { GET: () => new Response("dev"), POST: () => new Response("dev") };
export const signIn = nextAuth?.signIn ?? (async () => {});
export const signOut = nextAuth?.signOut ?? (async () => {});
export const auth = nextAuth?.auth ?? (async () => mockSession);
