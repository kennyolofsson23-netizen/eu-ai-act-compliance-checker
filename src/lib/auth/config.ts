import { NextAuthConfig } from "next-auth";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
if (!authSecret) {
  throw new Error(
    "AUTH_SECRET or NEXTAUTH_SECRET environment variable must be set",
  );
}

export const authConfig: Omit<NextAuthConfig, "providers"> = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isDashboard) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: authSecret,
};
