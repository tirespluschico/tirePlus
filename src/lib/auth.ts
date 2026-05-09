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

          const { data } = await supabase
            .from("shop_users")
            .select("id")
            .eq("email", user.email)
            .single();

          return !!data;
        },
        async session({ session }) {
          if (session.user?.email) {
            const { data } = await supabase
              .from("shop_users")
              .select("role")
              .eq("email", session.user.email)
              .single();

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
